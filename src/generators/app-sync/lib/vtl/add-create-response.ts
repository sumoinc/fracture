import { formatStringByNamingStrategy } from "../../../../core/naming-strategy";
import { Service } from "../../../../core/service";
import { Entity } from "../../../../model";
import { VtlSource } from "../../../vtl/vtl-source";

export const addCreateResponse = (service: Service, e: Entity) => {
  const operationName = `${e.fracture.namingStrategy.operations.crud.createName}-${e.name}`;
  const fileName = formatStringByNamingStrategy(
    `mutation-${operationName}-response`,
    e.fracture.namingStrategy.appsync.vtl.file
  );

  const resolver = new VtlSource(service, `app-sync/vtl/${fileName}.vtl`);

  resolver.line("$util.toJson($ctx.result)");
  resolver.line("\n");
};
