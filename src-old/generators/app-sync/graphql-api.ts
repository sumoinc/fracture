import { Service } from "../../services/service";
import { GeneratedTypescriptFile } from "../generated-typescript-file";

export class GraphqlApi extends GeneratedTypescriptFile {
  constructor(public readonly project: Service) {
    super(project, "app-sync/graphql-api.ts");

    // VTL requests / responses for each operation
    /*
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
    */
  }
}
