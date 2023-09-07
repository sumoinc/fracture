import { CreateResaolver } from "./resolvers/js/create-resolver";
import { DeleteResolver } from "./resolvers/js/delete-resolver";
import { ReadResolver } from "./resolvers/js/read-resolver";
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
          new ReadResolver(this.project, { operation });
          break;
        case OperationSubType.UPDATE_ONE:
          new UpdateResolver(this.project, { operation });
          break;
        case OperationSubType.DELETE_ONE:
          new DeleteResolver(this.project, { operation });
          break;
        default:
          break;
      }
    });
  }
}
