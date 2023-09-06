import { Operation } from "../../../services/operation";
import { Service } from "../../../services/service";
import { GeneratedVtlFile } from "../../generated-vtl-file";

export class VtlCreateResponse extends GeneratedVtlFile {
  constructor(
    public readonly project: Service,
    { operation }: { operation: Operation }
  ) {
    super(project, `app-sync/vtl/${operation.name}-response.vtl`);
  }

  preSynthesize(): void {
    super.preSynthesize();
    this.addLine("$util.toJson($ctx.result)");
    this.addLine("\n");
  }
}
