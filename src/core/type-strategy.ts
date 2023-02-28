import {
  ShapeAttributeGenerator,
  ShapeAttributeOptions,
  ShapeAttributeType,
} from "../model";

export type TypeStrategy = ShapeAttributeOptions;

export const defaultTypeStrategy: TypeStrategy = {
  name: "type",
  shortName: "t",
  comment: ["The type for this record."],
  type: ShapeAttributeType.STRING,
  createGenerator: ShapeAttributeGenerator.TYPE,
  isRequired: true,
};
