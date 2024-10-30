import {
  buildTx,
  findPublishedObject,
  getObjectIdsByObjectTypes,
} from "@/lib/sui";
import { ChainConfig, Transaction } from "@/store";
import { SuiClient } from "@mysten/sui/client";
import { Transaction as SuiTransaction } from "@mysten/sui/transactions";
import { TxBuilder } from "@axelar-network/axelar-cgp-sui";

export async function getRegisterTokenTx(
  client: SuiClient,
  sender: string,
  chainConfig: ChainConfig,
  symbol: string,
  transactions: Transaction[],
): Promise<SuiTransaction | undefined> {
  const transaction = transactions.find((tx) => tx.label === "Deploy Token");

  if (!transaction) return undefined;

  const publishedObject = findPublishedObject(transaction.changesObjects);

  if (!publishedObject) return undefined;

  const packageId = publishedObject?.packageId;
  const tokenType = `${packageId}::${symbol.toLowerCase()}::${symbol.toUpperCase()}`;

  const [TreasuryCap, Metadata] = getObjectIdsByObjectTypes(
    transaction.changesObjects,
    [`TreasuryCap<${tokenType}>`, `Metadata<${tokenType}>`],
  );

  const txBuilder = new TxBuilder(client);

  txBuilder.tx.setSenderIfNotSet(sender);

  const itsObjectId = chainConfig.contracts.ITS.objects?.ITS;
  const examplePackageId = chainConfig.contracts.Example.address;

  if (!itsObjectId || !examplePackageId) return undefined;

  await txBuilder.moveCall({
    target: `${examplePackageId}::its::register_coin`,
    typeArguments: [tokenType],
    arguments: [itsObjectId, Metadata],
  });

  return buildTx(sender, txBuilder);
}
