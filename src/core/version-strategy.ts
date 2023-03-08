import { ValueOf } from "type-fest";
import { ResourceAttributeOptions } from "./resource-attribute";

export const VERSION_TYPE = {
  DATE_TIME_STAMP: "datetimestamp",
} as const;

export type VersionStrategy = {
  attribute: ResourceAttributeOptions;
  type: ValueOf<typeof VERSION_TYPE>;
  currentVersion: string;
  deletedVersion: string;
};
