import { formatStringByNamingStrategy } from "../../../../core/naming-strategy";
import { Entity } from "../../../../model";
import { VtlSource } from "../../../vtl/vtl-source";

export const addDeleteRequest = (e: Entity) => {
  const operationName = `${e.fracture.namingStrategy.operations.crud.deleteName}-${e.name}`;
  const fileName = formatStringByNamingStrategy(
    `mutation-${operationName}-request`,
    e.fracture.namingStrategy.appsync.vtl.file
  );

  const resolver = new VtlSource(e.fracture, `app-sync/vtl/${fileName}.vtl`);
  resolver.line("\n");
};
