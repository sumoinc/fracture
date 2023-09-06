import { Operation } from "../../../services/operation";
import { Service } from "../../../services/service";
import { GeneratedVtlFile } from "../../generated-vtl-file";

export class VtlCreateRequest extends GeneratedVtlFile {
  constructor(
    public readonly project: Service,
    { operation }: { operation: Operation }
  ) {
    super(project, `app-sync/vtl/${operation.name}-request.vtl`);
  }
}
