import { Operation } from "../../../../services/operation";
import { Service } from "../../../../services/service";
import { GeneratedTypescriptFile } from "../../../generated-typescript-file";

export class ReadResolver extends GeneratedTypescriptFile {
  constructor(
    public readonly project: Service,
    { operation }: { operation: Operation }
  ) {
    super(project, `app-sync/resolvers/ts/${operation.name}.ts`);
  }

  /*
  preSynthesize(): void {
    super.preSynthesize();
    this.addLine("$util.toJson($ctx.result)");
    this.addLine("\n");
  }
  */
}
