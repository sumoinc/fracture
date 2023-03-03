import {
  ResourceAttributeGenerator,
  ResourceAttributeOptions,
  ResourceAttributeType,
} from "../core/resource-attribute";

export type TypeStrategy = ResourceAttributeOptions;

export const defaultTypeStrategy: TypeStrategy = {
  name: "type",
  shortName: "t",
  comment: ["The type for this record."],
  type: ResourceAttributeType.STRING,
  createGenerator: ResourceAttributeGenerator.TYPE,
  readGenerator: ResourceAttributeGenerator.TYPE,
  updateGenerator: ResourceAttributeGenerator.TYPE,
  deleteGenerator: ResourceAttributeGenerator.TYPE,
  isRequired: true,
};
