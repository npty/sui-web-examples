import { SuiObjectChange } from "@mysten/sui/client";

export const findPublishedObject = (objectChanges: SuiObjectChange[]) => {
  return objectChanges.find((change) => change.type === "published");
};

export const getObjectIdsByObjectTypes = (
  objectChanges: SuiObjectChange[],
  objectTypes: string[],
) => {
  objectTypes.map((objectType) => {
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
