import {
  ShapeAttributeGenerator,
  ShapeAttributeOptions,
  ShapeAttributeType,
} from "../model";

export type PartitionKeyStrategy = ShapeAttributeOptions;

export const guidPartitionKeyStrategy: PartitionKeyStrategy = {
  name: "id",
  comment: [`The unique identifier for this record.`],
  type: ShapeAttributeType.GUID,
  createGenerator: ShapeAttributeGenerator.GUID,
  isRequired: true,
};

export const defaultPartitionKeyStrategy = guidPartitionKeyStrategy;
