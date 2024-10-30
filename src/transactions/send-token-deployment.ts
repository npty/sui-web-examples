import { buildTx, findPublishedObject } from "@/lib/sui";
import { ChainConfig, Transaction } from "@/store";
import { SuiClient } from "@mysten/sui/client";
import { Transaction as SuiTransaction } from "@mysten/sui/transactions";
import { TxBuilder } from "@axelar-network/axelar-cgp-sui";

export async function getSendTokenDeploymentTx(
  client: SuiClient,
  sender: string,
  chainConfig: ChainConfig,
  symbol: string,
  transactions: Transaction[],
): Promise<SuiTransaction | undefined> {
  const registerTokenTx = transactions.find(
    (tx) => tx.label === "Register Token",
  );
  if (!registerTokenTx) return undefined;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tokenId = (registerTokenTx?.events[0]?.parsedJson as any).token_id?.id;
  if (!tokenId) return undefined;

  const deployTokenTx = transactions.find((tx) => tx.label === "Deploy Token");
  if (!deployTokenTx) return undefined;

  const publishedObject = findPublishedObject(deployTokenTx.changesObjects);
  if (!publishedObject) return undefined;

  const packageId = publishedObject?.packageId;
  const tokenType = `${packageId}::${symbol.toLowerCase()}::${symbol.toUpperCase()}`;

  // Fixed fee to 0.05 SUI for now
  const feeUnitAmount = 5e7;
  const ITS = chainConfig.contracts.ITS;
  const Example = chainConfig.contracts.Example;
  const AxelarGateway = chainConfig.contracts.AxelarGateway;
  const GasService = chainConfig.contracts.GasService;

  if (!ITS.trustedAddresses) return undefined;

  const destinationChain = Object.keys(ITS.trustedAddresses)[0];

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
