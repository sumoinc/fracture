import { FractureComponent } from "../../core";
import { Operation } from "../../core/operation";

export class TypescriptOperation extends FractureComponent {
  public readonly operation: Operation;
  //public readonly outdir: string;

  constructor(operation: Operation) {
    super(operation.fracture);

    this.operation = operation;
    // this.outdir = join(this.fracture.outdir, this.service.name);
  }
}
