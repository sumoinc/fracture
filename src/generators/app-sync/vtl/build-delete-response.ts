import { formatStringByNamingStrategy } from "../../../core/naming-strategy";
import { Resource } from "../../../core/resource";
import { Service } from "../../../core/service";
import { VtlSource } from "../../vtl/vtl-source";

export const buildDeleteResponse = (service: Service, e: Resource) => {
  const operationName = `${e.fracture.namingStrategy.operations.crud.deleteName}-${e.name}`;
  const fileName = formatStringByNamingStrategy(
    `mutation-${operationName}-response`,
    e.fracture.namingStrategy.appsync.vtl.file
  );

  const resolver = new VtlSource(service, `app-sync/vtl/${fileName}.vtl`);

  resolver.line("$util.toJson($ctx.result)");
  resolver.line("\n");
};
