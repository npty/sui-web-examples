import { TxBuilder } from "@axelar-network/axelar-cgp-sui";
import { SuiEvent, SuiObjectChange } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";

export const findPublishedObject = (objectChanges: SuiObjectChange[]) => {
  return objectChanges.find((change) => change.type === "published");
};

export const getObjectIdsByObjectTypes = (
  objectChanges: SuiObjectChange[],
  objectTypes: string[],
) => {
  return objectTypes.map((objectType) => {
    const createdObjects = objectChanges.filter(
      (change) => change.type === "created",
    );

    const objectId = createdObjects.find((change) =>
      change.objectType?.includes(objectType),
    )?.objectId;

    if (!objectId) {
      throw new Error(`No object found for type: ${objectType}`);
    }

    return objectId;
  });
};

export const getEventDataByEventTypes = (
  events: SuiEvent[],
  eventTypes: string[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any[] => {
  return eventTypes.map((eventType) => {
    const event = events.find((event) => event.type.includes(eventType));

    return event?.parsedJson;
  });
};

export async function buildTx(walletAddress: string, txBuilder: TxBuilder) {
  txBuilder.tx.setSender(walletAddress);

  const txBytes = await txBuilder.tx.build({
    client: txBuilder.client,
  });

  return Transaction.from(txBytes);
}
