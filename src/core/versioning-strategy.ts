import { ValueOf } from "type-fest";
import { ShapeAttributeOptions, ShapeAttributeType } from "../model";

export const VERSION_TYPE = {
  DATE_TIME_STAMP: "datetimestamp",
} as const;

export type VersioningStrategy = {
  attribute: ShapeAttributeOptions;
  type: ValueOf<typeof VERSION_TYPE>;
  currentVersion: string;
  deletedVersion: string;
};

export const defaultVersioningStrategy: VersioningStrategy = {
  attribute: {
    name: "version",
    shortName: "v",
    comment: [`The version of this record`, `@default "LATEST"`],
    type: ShapeAttributeType.STRING,
  },
  type: VERSION_TYPE.DATE_TIME_STAMP,
  currentVersion: "LATEST",
  deletedVersion: "DELETED",
};
