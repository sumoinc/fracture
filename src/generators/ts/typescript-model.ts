import { SourceCode } from "projen";
import { FractureComponent } from "../../core/component";
import {
  CommandNamingStrategy,
  CrudNamingStrategy,
  Fracture,
  NamingStrategy,
} from "../../core/fracture";
import { formatLabel } from "../../lib/format-label";

export class TypeScriptModel extends FractureComponent {
  public readonly namingStrategy: NamingStrategy;
  public readonly commandLabels: CommandNamingStrategy;
  public readonly crudLabels: CrudNamingStrategy;

  constructor(fracture: Fracture) {
    super(fracture);

    const ns = fracture.typeScriptNamingStrategy;
    this.namingStrategy = ns.namingStrategy;
    this.commandLabels = ns.commandNamingStrategy;
    this.crudLabels = ns.crudNamingStrategy;
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
        `${this.fracture.outdir}/types/${name}`
      );
      f.line("// " + f.marker);
      f.line("\n");
      return f;
    };

    /**
     * Crerate index file and import all entity types.
     */
    const indexFile = typeScriptFile("index.ts");

    /**
     * Generate types for each entity.
     */
    this.fracture.entities.forEach((e) => {
      // add to index for export
      indexFile.line(`export * from "./${e.name}";`);

      // generate types for this entity
      const tsFile = typeScriptFile(`${e.name}.ts`);

      /*************************************************************************
       *  INTERFACE / OUTPUT
       ************************************************************************/

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

      /*************************************************************************
       *  INPUT DATA
       ************************************************************************/

      // build interface
      tsFile.open(
        `export interface ${e.name}${this.commandLabels.inputDataLabel} {`
      );
      e.dataAttributes.forEach((a) => {
        const q = a.isRequired ? "" : "?";
        tsFile.line(`${a.name}${q}: ${a.typeScriptType};`);
      });
      tsFile.close(`}`);
      tsFile.line("\n");

      /*************************************************************************
       *  CREATE INPUT
       ************************************************************************/

      tsFile.open(
        `export interface ${this.crudLabels.createLabel}${e.name}${this.commandLabels.commandInputLabel} {`
      );
      const createName = formatLabel(
        e.name,
        this.namingStrategy.attributeStrategy
      );
      tsFile.line(
        `${createName}${this.commandLabels.inputDataLabel}: ${e.name}${this.commandLabels.inputDataLabel};`
      );
      tsFile.close(`}`);
      tsFile.line("\n");

      /*************************************************************************
       *  READ INPUT
       ************************************************************************/

      tsFile.open(
        `export interface ${this.crudLabels.readLabel}${e.name}${this.commandLabels.commandInputLabel} {`
      );
      e.keyAttributes.forEach((a) => {
        // write type definition
        const q = a.isRequired ? "" : "?";
        tsFile.line(`${a.name}${q}: ${a.typeScriptType};`);
      });
      tsFile.close(`}`);
      tsFile.line("\n");

      /*************************************************************************
       *  UPDATE INPUT
       ************************************************************************/

      tsFile.open(
        `export interface ${this.crudLabels.updateLabel}${e.name}${this.commandLabels.commandInputLabel} {`
      );
      e.keyAttributes.forEach((a) => {
        // write type definition
        const q = a.isRequired ? "" : "?";
        tsFile.line(`${a.name}${q}: ${a.typeScriptType};`);
      });
      const updateName = formatLabel(
        e.name,
        this.namingStrategy.attributeStrategy
      );
      tsFile.line(
        `${updateName}${this.commandLabels.inputDataLabel}: ${e.name}${this.commandLabels.inputDataLabel};`
      );
      tsFile.close(`}`);
      tsFile.line("\n");

      /*************************************************************************
       *  DELETE INPUT
       ************************************************************************/

      tsFile.open(
        `export interface ${this.crudLabels.deleteLabel}${e.name}${this.commandLabels.commandInputLabel} {`
      );
      e.keyAttributes.forEach((a) => {
        // write type definition
        const q = a.isRequired ? "" : "?";
        tsFile.line(`${a.name}${q}: ${a.typeScriptType};`);
      });
      tsFile.close(`}`);
      tsFile.line("\n");

      /*************************************************************************
       *  LIST INPUT
       ************************************************************************/

      tsFile.open(
        `export interface ${this.crudLabels.listLabel}${e.name}${this.commandLabels.commandInputLabel} {`
      );
      e.listAttributes.forEach((a) => {
        // write type definition
        const q = a.isRequired ? "" : "?";
        tsFile.line(`${a.name}${q}: ${a.typeScriptType};`);
      });
      tsFile.close(`}`);
      tsFile.line("\n");

      /*************************************************************************
       *  Outputs
       ************************************************************************/

      tsFile.open(
        `export interface ${this.crudLabels.createLabel}${e.name}${this.commandLabels.commandOutputLabel} {`
      );
      const outputName = formatLabel(
        e.name,
        this.namingStrategy.attributeStrategy
      );
      tsFile.line(`${outputName}: ${e.name};`);
      tsFile.close(`}`);
      tsFile.line("\n");
    });

    // close up index file
    indexFile.line("\n");
  }
}
