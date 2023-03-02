import { buildCommandNames } from "./build-command-names";
import { Resource } from "../../../core/resource";
import { buildResourceAttribute } from "../interface/build-attribute";
import { TypeScriptSource } from "../typescript-source";

export const buildCommandInputOutput = (f: TypeScriptSource, e: Resource) => {
  const names = buildCommandNames(e);

  /*****************************************************************************
   * CREATE
   ****************************************************************************/

  f.open(`export interface ${names.create.input} {`);
  e.dataAttributes.forEach((a) => {
    buildResourceAttribute(f, a);
  });
  f.close(`}`);
  f.line("\n");

  f.open(`export interface ${names.create.output} {`);
  e.partitionKeyAttributes.forEach((a) => {
    buildResourceAttribute(f, a);
  });
  f.close(`}`);
  f.line("\n");

  /*****************************************************************************
   * READ
   ****************************************************************************/

  f.open(`export interface ${names.read.input} {`);
  e.partitionKeyAttributes.forEach((a) => {
    buildResourceAttribute(f, a);
  });
  f.close(`}`);
  f.line("\n");

  /*****************************************************************************
   * UPDATE
   ****************************************************************************/

  f.open(`export interface ${names.update.input} {`);
  e.partitionKeyAttributes.forEach((a) => {
    buildResourceAttribute(f, a);
  });
  e.dataAttributes.forEach((a) => {
    buildResourceAttribute(f, a);
  });
  f.close(`}`);
  f.line("\n");

  f.open(`export interface ${names.update.output} {`);
  e.partitionKeyAttributes.forEach((a) => {
    buildResourceAttribute(f, a);
  });
  f.close(`}`);
  f.line("\n");

  /*****************************************************************************
   * DELETE
   ****************************************************************************/

  f.open(`export interface ${names.delete.input} {`);
  e.partitionKeyAttributes.forEach((a) => {
    buildResourceAttribute(f, a);
  });
  f.close(`}`);
  f.line("\n");

  f.open(`export interface ${names.update.output} {`);
  e.partitionKeyAttributes.forEach((a) => {
    buildResourceAttribute(f, a);
  });
  f.close(`}`);
  f.line("\n");
};
