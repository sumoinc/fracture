import { SourceCode } from "projen";
import { FractureComponent } from "../../core/component";
import { Fracture } from "../../core/fracture";

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

    // create index file
    const indexFile = typeScriptFile("index.ts");

    /**
     * Generate types for each entity.
     */
    this.fracture.entities.forEach((e) => {
      // add to index for export
      indexFile.line(`export * from "./${e.name}";`);

      // generate types for this entity
      const tsFile = typeScriptFile(`${e.name}.ts`);

      // generate helpful comments
      tsFile.line(`/**`);
      e.comment.forEach((c) => tsFile.line(` * ${c}`));
      tsFile.line(` */`);

      // build interface
      tsFile.open(`export interface ${e.name} {`);
      e.attributes.forEach((a) => {
        // generate helpful comments
        tsFile.line(`/**`);
        a.comment.forEach((c) => tsFile.line(` * ${c}`));
        tsFile.line(` */`);
        // console.log(a);

        // write type definition
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
