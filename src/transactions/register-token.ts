import {
  buildTx,
  findPublishedObject,
  getObjectIdsByObjectTypes,
} from "@/lib/sui";
import { ChainConfig, Transaction } from "@/store";
import { SuiClient } from "@mysten/sui/client";
import { Transaction as SuiTransaction } from "@mysten/sui/transactions";
import { SUI_PACKAGE_ID, TxBuilder } from "@axelar-network/axelar-cgp-sui";
import { SendDeploymentDetails } from "@/features/send-deployment/types";

export async function getRegisterTokenTx(
  client: SuiClient,
  sender: string,
  chainConfig: ChainConfig,
  data: SendDeploymentDetails,
  transactions: Transaction[],
): Promise<SuiTransaction | undefined> {
  const transaction = transactions.find((tx) => tx.label === "Deploy Token");

  if (!transaction) return undefined;

  const publishedObject = findPublishedObject(transaction.changesObjects);

  if (!publishedObject) return undefined;

  const { tokenSymbol, initialSupply } = data;

  const packageId = publishedObject?.packageId;
  const [treasuryCap] = getObjectIdsByObjectTypes(transaction.changesObjects, [
    "TreasuryCap",
  ]);
  const tokenType = `${packageId}::${tokenSymbol.toLowerCase()}::${tokenSymbol.toUpperCase()}`;

  const [Metadata] = getObjectIdsByObjectTypes(transaction.changesObjects, [
    `Metadata<${tokenType}>`,
  ]);

  const txBuilder = new TxBuilder(client);

  txBuilder.tx.setSenderIfNotSet(sender);

  const itsObjectId = chainConfig.contracts.ITS.objects?.ITS;
  const examplePackageId = chainConfig.contracts.Example.address;

  if (!itsObjectId || !examplePackageId) return undefined;

  const Coin = await txBuilder.moveCall({
    target: `${SUI_PACKAGE_ID}::coin::mint`,
    arguments: [treasuryCap, initialSupply.toString()],
    typeArguments: [tokenType],
  });

  txBuilder.tx.transferObjects([Coin], sender);

  await txBuilder.moveCall({
    target: `${examplePackageId}::its::register_coin`,
    typeArguments: [tokenType],
    arguments: [itsObjectId, Metadata],
  });

  return buildTx(sender, txBuilder);
}
