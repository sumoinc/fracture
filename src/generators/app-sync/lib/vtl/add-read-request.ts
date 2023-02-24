import { formatStringByNamingStrategy } from "../../../../core/naming-strategy";
import { Entity } from "../../../../model";
import { VtlSource } from "../../../vtl/vtl-source";

export const addReadRequest = (e: Entity) => {
  const operationName = `${e.fracture.namingStrategy.operations.crud.readName}-${e.name}`;
  const fileName = formatStringByNamingStrategy(
    `query-${operationName}-request`,
    e.fracture.namingStrategy.appsync.vtl.file
  );

  const resolver = new VtlSource(e.fracture, `app-sync/vtl/${fileName}.vtl`);
  resolver.line("\n");
};
