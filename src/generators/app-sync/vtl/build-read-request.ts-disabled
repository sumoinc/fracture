import { formatStringByNamingStrategy } from "../../../core/naming-strategy";
import { Resource } from "../../../core/resource";
import { Service } from "../../../core/service";
import { VtlSource } from "../../vtl/vtl-source";

export const buildReadRequest = (service: Service, e: Resource) => {
  const operationName = `${e.fracture.namingStrategy.operations.crud.readName}-${e.name}`;
  const fileName = formatStringByNamingStrategy(
    `query-${operationName}-request`,
    e.fracture.namingStrategy.appsync.vtl.file
  );

  const resolver = new VtlSource(service, `app-sync/vtl/${fileName}.vtl`);
  resolver.line("\n");
};
