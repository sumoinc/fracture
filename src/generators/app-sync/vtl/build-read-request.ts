import { formatStringByNamingStrategy } from "../../../core/naming-strategy";
import { Service } from "../../../core/service";
import { Shape } from "../../../model";
import { VtlSource } from "../../vtl/vtl-source";

export const buildReadRequest = (service: Service, e: Shape) => {
  const operationName = `${e.fracture.namingStrategy.operations.crud.readName}-${e.name}`;
  const fileName = formatStringByNamingStrategy(
    `query-${operationName}-request`,
    e.fracture.namingStrategy.appsync.vtl.file
  );

  const resolver = new VtlSource(service, `app-sync/vtl/${fileName}.vtl`);
  resolver.line("\n");
};
