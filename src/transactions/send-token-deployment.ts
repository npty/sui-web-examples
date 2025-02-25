import { buildTx, findPublishedObject } from "@/lib/sui";
import { ChainConfig, Transaction } from "@/store";
import { SuiClient } from "@mysten/sui/client";
import { Transaction as SuiTransaction } from "@mysten/sui/transactions";
import { TxBuilder } from "@axelar-network/axelar-cgp-sui";

export async function getSendTokenDeploymentTx(
  client: SuiClient,
  sender: string,
  chainConfig: ChainConfig,
  destinationChain: string,
  symbol: string,
  transactions: Transaction[],
): Promise<SuiTransaction | undefined> {
  interface RegisterTokenEvent {
    token_id: {
      id: string;
    };
  }

  const registerTokenTx = transactions.find(
    (tx) => tx.label === "Register Token",
  );
  if (!registerTokenTx) {
    throw new Error("Register Token transaction not found");
  }

  const firstEvent = registerTokenTx.events[0];
  if (!firstEvent?.parsedJson) {
    throw new Error("Invalid transaction event data");
  }

  const tokenId = (firstEvent.parsedJson as RegisterTokenEvent).token_id?.id;
  if (!tokenId) {
    throw new Error("Token ID not found in transaction events");
  }

  const deployTokenTx = transactions.find((tx) => tx.label === "Deploy Token");
  if (!deployTokenTx) {
    throw new Error("Deploy Token transaction not found");
  }

  const publishedObject = findPublishedObject(deployTokenTx.changesObjects);
  if (!publishedObject) {
    throw new Error("Published object not found in transaction changes");
  }

  const packageId = publishedObject?.packageId;
  const tokenType = `${packageId}::${symbol.toLowerCase()}::${symbol.toUpperCase()}`;

  // Fixed fee to 0.02 SUI for now
  const feeUnitAmount = 2e7;
  const ITS = chainConfig.contracts.ITS;
  const Example = chainConfig.contracts.Example;
  const AxelarGateway = chainConfig.contracts.AxelarGateway;
  const GasService = chainConfig.contracts.GasService;

  if (!ITS.trustedAddresses) return undefined;

  if (
    !ITS?.objects ||
    !Example?.objects ||
    !AxelarGateway?.objects ||
    !GasService?.objects
  )
    return undefined;

  if (!destinationChain) return undefined;

  const txBuilder = new TxBuilder(client);
  const tx = txBuilder.tx;
  const gas = tx.splitCoins(tx.gas, [feeUnitAmount]);

  const TokenId = await txBuilder.moveCall({
    target: `${ITS.address}::token_id::from_u256`,
    arguments: [tokenId],
  });

  await txBuilder.moveCall({
    target: `${Example.address}::its::deploy_remote_interchain_token`,
    arguments: [
      ITS.objects.ITS,
      AxelarGateway.objects.Gateway,
      GasService.objects.GasService,
      destinationChain,
      TokenId,
      gas,
      "0x",
      sender,
    ],
    typeArguments: [tokenType],
  });

  return buildTx(sender, txBuilder);
}
