import { TxBuilder } from "@axelar-network/axelar-cgp-sui";
import { SuiEvent, SuiObjectChange } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";

/**
 * Finds the first published object in a list of Sui object changes
 * @param objectChanges - Array of SuiObjectChange objects
 * @returns The published object change or undefined if not found
 */
export const findPublishedObject = (objectChanges: SuiObjectChange[]) => {
  return objectChanges.find((change) => change.type === "published");
};

/**
 * Retrieves object IDs for specified object types from Sui object changes
 * @param objectChanges - Array of SuiObjectChange objects
 * @param objectTypes - Array of object type strings to search for
 * @returns Array of object IDs corresponding to the requested types
 * @throws Error if an object type is not found
 */
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

/**
 * Extracts parsed JSON data from Sui events matching specified event types
 * @param events - Array of SuiEvent objects
 * @param eventTypes - Array of event type strings to search for
 * @returns Array of parsed JSON data from matching events
 */
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

/**
 * Constructs a token type string from a published object's metadata
 * @param objectChanges - Array of SuiObjectChange objects
 * @returns Formatted token type string (package::module::TOKEN) or undefined if not found
 */
export const getTokenTypeFromPublishedObject = (
  objectChanges: SuiObjectChange[],
) => {
  const publishedObject = objectChanges.find(
    (change) => change.type === "published",
  );

  if (!publishedObject) return undefined;

  const packageId = publishedObject.packageId;
  const moduleName = publishedObject.modules[0];

  if (!moduleName) return undefined;

  const tokenType = `${packageId}::${moduleName.toLowerCase()}::${moduleName.toUpperCase()}`;

  return tokenType;
};

/**
 * Builds a Sui transaction from a TxBuilder instance
 * @param walletAddress - The sender's wallet address
 * @param txBuilder - The transaction builder instance
 * @returns A built Transaction object ready for signing and execution
 */
export async function buildTx(walletAddress: string, txBuilder: TxBuilder) {
  txBuilder.tx.setSender(walletAddress);

  const txBytes = await txBuilder.tx.build({
    client: txBuilder.client,
  });

  return Transaction.from(txBytes);
}
