import {
  ShapeAttributeGenerator,
  ShapeAttributeOptions,
  ShapeAttributeType,
} from "../model";

export type PartitionKeyStrategy = Pick<
  ShapeAttributeOptions,
  "name" | "comment" | "type" | "createGenerator"
>;

export const guidPartitionKeyStrategy: PartitionKeyStrategy = {
  name: "id",
  comment: [`The unique identifier for this record.`],
  type: ShapeAttributeType.GUID,
  createGenerator: ShapeAttributeGenerator.GUID,
};

export const defaultPartitionKeyStrategy = guidPartitionKeyStrategy;
