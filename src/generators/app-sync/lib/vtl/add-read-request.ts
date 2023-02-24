import { formatStringByNamingStrategy } from "../../../../core/naming-strategy";
import { Service } from "../../../../core/service";
import { Entity } from "../../../../model";
import { VtlSource } from "../../../vtl/vtl-source";

export const addReadRequest = (service: Service, e: Entity) => {
  const operationName = `${e.fracture.namingStrategy.operations.crud.readName}-${e.name}`;
  const fileName = formatStringByNamingStrategy(
    `query-${operationName}-request`,
    e.fracture.namingStrategy.appsync.vtl.file
  );

  const resolver = new VtlSource(service, `app-sync/vtl/${fileName}.vtl`);
  resolver.line("\n");
};
