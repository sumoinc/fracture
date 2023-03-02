import { ValueOf } from "type-fest";
import {
  ResourceAttributeGenerator,
  ResourceAttributeOptions,
  ResourceAttributeType,
} from "../core/resource-attribute";

export const VERSION_TYPE = {
  DATE_TIME_STAMP: "datetimestamp",
} as const;

export type VersioningStrategy = {
  attribute: ResourceAttributeOptions;
  type: ValueOf<typeof VERSION_TYPE>;
  currentVersion: string;
  deletedVersion: string;
};

export const defaultVersioningStrategy: VersioningStrategy = {
  attribute: {
    name: "version",
    shortName: "v",
    comment: [`The version of this record`, `@default "LATEST"`],
    type: ResourceAttributeType.STRING,
    createGenerator: ResourceAttributeGenerator.VERSION,
    updateGenerator: ResourceAttributeGenerator.VERSION,
    deleteGenerator: ResourceAttributeGenerator.VERSION,
  },
  type: VERSION_TYPE.DATE_TIME_STAMP,
  currentVersion: "LATEST",
  deletedVersion: "DELETED",
};
