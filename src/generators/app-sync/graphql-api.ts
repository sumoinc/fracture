import { CreateResaolver } from "./resolvers/js/create-resolver";
import { UpdateResolver } from "./resolvers/js/update-resolver";
import { Operation, OperationSubType } from "../../services/operation";
import { Service } from "../../services/service";
import { GeneratedTypescriptFile } from "../generated-typescript-file";

export class GraphqlApi extends GeneratedTypescriptFile {
  constructor(public readonly project: Service) {
    super(project, "app-sync/graphql-api.ts");

    // VTL requests / responses for each operation
    Operation.all(this.project).forEach((operation) => {
      switch (operation.operationSubType) {
        case OperationSubType.CREATE_ONE:
          new CreateResaolver(this.project, { operation });
          break;
        case OperationSubType.READ_ONE:
          break;
        case OperationSubType.UPDATE_ONE:
          new UpdateResolver(this.project, { operation });

          break;
        case OperationSubType.DELETE_ONE:
          break;
        default:
          break;
      }
    });
  }
}
