import { buildCommandNames } from "./build-command-names";
import { Shape } from "../../../model";
import { buildShapeAttribute } from "../interface/build-attribute";
import { TypeScriptSource } from "../typescript-source";

export const buildCommandInputOutput = (f: TypeScriptSource, e: Shape) => {
  const names = buildCommandNames(e);

  /*****************************************************************************
   * CREATE
   ****************************************************************************/

  f.open(`export interface ${names.create.input} {`);
  e.dataShapeAttributes.forEach((a) => {
    buildShapeAttribute(f, a);
  });
  f.close(`}`);
  f.line("\n");

  f.open(`export interface ${names.create.output} {`);
  e.partitionKeyAttributes.forEach((a) => {
    buildShapeAttribute(f, a);
  });
  f.close(`}`);
  f.line("\n");

  /*****************************************************************************
   * READ
   ****************************************************************************/

  f.open(`export interface ${names.read.input} {`);
  e.partitionKeyAttributes.forEach((a) => {
    buildShapeAttribute(f, a);
  });
  f.close(`}`);
  f.line("\n");

  /*****************************************************************************
   * UPDATE
   ****************************************************************************/

  f.open(`export interface ${names.update.input} {`);
  e.partitionKeyAttributes.forEach((a) => {
    buildShapeAttribute(f, a);
  });
  e.dataShapeAttributes.forEach((a) => {
    buildShapeAttribute(f, a);
  });
  f.close(`}`);
  f.line("\n");

  f.open(`export interface ${names.update.output} {`);
  e.partitionKeyAttributes.forEach((a) => {
    buildShapeAttribute(f, a);
  });
  f.close(`}`);
  f.line("\n");

  /*****************************************************************************
   * DELETE
   ****************************************************************************/

  f.open(`export interface ${names.delete.input} {`);
  e.partitionKeyAttributes.forEach((a) => {
    buildShapeAttribute(f, a);
  });
  f.close(`}`);
  f.line("\n");

  f.open(`export interface ${names.update.output} {`);
  e.partitionKeyAttributes.forEach((a) => {
    buildShapeAttribute(f, a);
  });
  f.close(`}`);
  f.line("\n");
};
