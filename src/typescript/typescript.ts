import { SourceCode } from "projen";
import { FractureComponent } from "../core/component";
import { Fracture } from "../core/fracture";

export class TypeScript extends FractureComponent {
  constructor(fracture: Fracture) {
    super(fracture);
  }

  public preSynthesize() {
    /**
     * Build a TypeScript file and make sure it's marked as being managed by
     * projen.
     *
     * @param name
     * @returns {SourceCode}
     */
    const typeScriptFile = (name: string): SourceCode => {
      const f = new SourceCode(
        this.project,
        `${this.fracture.gendir}/types/${name}`
      );
      f.line("// " + f.marker);
      f.line("\n");
      return f;
    };

    const indexFile = typeScriptFile("index.ts");
    this.fracture.entities.forEach((e) => {
      // add to index for export
      indexFile.line(`export * from "./${e.name}";`);

      // generate types for this entity
      const tsFile = typeScriptFile(`${e.name}.ts`);

      tsFile.open(`export interface ${e.name} {`);
      e.attributes.forEach((a) => {
        const q = a.isRequired ? "" : "?";
        tsFile.line(`${a.name}${q}: ${a.typeScriptType};`);
      });
      tsFile.close(`}`);
      tsFile.line("\n");
    });
    // close up index file
    indexFile.line("\n");
  }
}
