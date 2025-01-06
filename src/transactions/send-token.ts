import { buildTx } from "@/lib/sui";
import { ChainConfig } from "@/store";
import { SuiClient } from "@mysten/sui/client";
import { Transaction as SuiTransaction } from "@mysten/sui/transactions";
import { CLOCK_PACKAGE_ID, TxBuilder } from "@axelar-network/axelar-cgp-sui";
import { SendTokenDetails } from "@/features/send-token/types";

export async function getSendTokenTx(
  client: SuiClient,
  sender: string,
  chainConfig: ChainConfig,
  sendTokenDetails: SendTokenDetails,
): Promise<SuiTransaction | undefined> {
  const {
    tokenId,
    tokenType,
    amount,
    destinationChain,
    destinationAddress,
    gas,
    coinObjectId,
  } = sendTokenDetails;

  const { ITS, Example, AxelarGateway, GasService } = chainConfig.contracts;
  if (
    !ITS.objects ||
    !Example.objects ||
    !AxelarGateway.objects ||
    !GasService.objects
  ) {
    throw new Error("Missing objects");
  }

  const txBuilder = new TxBuilder(client);
  const tx = txBuilder.tx;

  // split coins for gas
  const Gas = tx.splitCoins(tx.gas, [gas]);

  // split token to transfer to the destination chain
  const Coin = tx.splitCoins(coinObjectId, [amount]);
  const TokenId = await txBuilder.moveCall({
    target: `${ITS.address}::token_id::from_u256`,
    arguments: [tokenId],
  });

  const args = [
    Example.objects.ItsSingleton,
    ITS.objects.ITS,
    AxelarGateway.objects.Gateway,
    GasService.objects.GasService,
    TokenId,
    Coin,
    destinationChain,
    destinationAddress,
    "0x",
    sender,
    Gas,
    "0x",
    CLOCK_PACKAGE_ID,
  ];

  await txBuilder.moveCall({
    target: `${Example.address}::its::send_interchain_transfer_call`,
    arguments: args,
    typeArguments: [tokenType],
  });

  return buildTx(sender, txBuilder);
}
