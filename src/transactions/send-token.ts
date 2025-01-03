import { buildTx } from "@/lib/sui";
import { ChainConfig, Transaction } from "@/store";
import { SuiClient } from "@mysten/sui/client";
import { Transaction as SuiTransaction } from "@mysten/sui/transactions";
import {
  CLOCK_PACKAGE_ID,
  SUI_PACKAGE_ID,
  TxBuilder,
} from "@axelar-network/axelar-cgp-sui";
import { SendTokenDetails } from "@/features/send-token/types";

export async function getSendTokenTx(
  client: SuiClient,
  sender: string,
  chainConfig: ChainConfig,
  sendTokenDetails: SendTokenDetails,
): Promise<SuiTransaction | undefined> {
  const {
    tokenId,
    treasuryCap,
    tokenType,
    amount,
    destinationChain,
    destinationAddress,
    gas,
  } = sendTokenDetails;

  console.log("sendTokenDetails", sendTokenDetails);

  const txBuilder = new TxBuilder(client);

  txBuilder.tx.setSenderIfNotSet(sender);

  const ITS = chainConfig.contracts.ITS;

  const TokenId = await txBuilder.moveCall({
    target: `${ITS.address}::token_id::from_u256`,
    arguments: [tokenId],
  });

  const Coin = await txBuilder.moveCall({
    target: `${SUI_PACKAGE_ID}::coin::mint`,
    arguments: [treasuryCap, amount],
    typeArguments: [tokenType],
  });

  const Gas = txBuilder.tx.splitCoins(txBuilder.tx.gas, [gas]);

  const Gateway = chainConfig.contracts.AxelarGateway;
  const GasService = chainConfig.contracts.GasService;
  const Example = chainConfig.contracts.Example;

  if (
    !ITS.objects ||
    !Example.objects ||
    !Gateway.objects ||
    !GasService.objects
  ) {
    throw new Error("Missing objects");
  }

  // TODO: fix this
  const args = [
    Example.objects.ItsSingleton,
    ITS.objects.ITS,
    Gateway.objects.Gateway,
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
