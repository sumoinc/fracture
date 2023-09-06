import { Operation } from "../../../services/operation";
import { Service } from "../../../services/service";
import { GeneratedVtlFile } from "../../generated-vtl-file";

export class VtlUpdateRequest extends GeneratedVtlFile {
  constructor(
    public readonly project: Service,
    { operation }: { operation: Operation }
  ) {
    super(project, `app-sync/vtl/${operation.name}-request.vtl`);
  }

  /*
  public preSynthesize() {
    this.service.resources
      .filter((e) => e.persistant)
      .forEach((e) => {
        buildAllVtl(this.service, e);
        //buildAllLambda(e);
      });
  }
  */
}
