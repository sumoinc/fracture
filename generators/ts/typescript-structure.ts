import { FractureComponent } from "../../core";
import { Structure } from "../../core/structure";

export class TypescriptStructure extends FractureComponent {
  public readonly structure: Structure;
  public readonly outdir: string;

  constructor(structure: Structure) {
    super(structure.fracture);

    this.structure = structure;
    // this.outdir = join(this.fracture.outdir, this.service.name);
  }
}
