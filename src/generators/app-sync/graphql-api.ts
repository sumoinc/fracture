import { VtlCreateRequest } from "./vtl/create-request";
import { VtlCreateResponse } from "./vtl/create-response";
import { VtlDeleteRequest } from "./vtl/delete-request";
import { VtlDeleteResponse } from "./vtl/delete-response";
import { VtlReadRequest } from "./vtl/read-request";
import { VtlReadResponse } from "./vtl/read-response";
import { VtlUpdateRequest } from "./vtl/update-request";
import { VtlUpdateResponse } from "./vtl/update-response";
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
          new VtlCreateRequest(this.project, { operation });
          new VtlCreateResponse(this.project, { operation });
          break;
        case OperationSubType.READ_ONE:
          new VtlReadRequest(this.project, { operation });
          new VtlReadResponse(this.project, { operation });
          break;
        case OperationSubType.UPDATE_ONE:
          new VtlUpdateRequest(this.project, { operation });
          new VtlUpdateResponse(this.project, { operation });
          break;
        case OperationSubType.DELETE_ONE:
          new VtlDeleteRequest(this.project, { operation });
          new VtlDeleteResponse(this.project, { operation });
          break;
        default:
          break;
      }
    });
  }
}
