import {
  ResourceAttributeGenerator,
  ResourceAttributeOptions,
  ResourceAttributeType,
} from "./resource-attribute";

export type PartitionKeyStrategy = ResourceAttributeOptions;

export const guidPartitionKeyStrategy: PartitionKeyStrategy = {
  name: "id",
  comment: [`The unique identifier for this record.`],
  type: ResourceAttributeType.GUID,
  createGenerator: ResourceAttributeGenerator.GUID,
  isRequired: true,
};

export const defaultPartitionKeyStrategy = guidPartitionKeyStrategy;
