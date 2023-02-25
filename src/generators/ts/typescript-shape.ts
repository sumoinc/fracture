import { addCreateCommand } from "./lib/add-create-command";
import { addInterface } from "./lib/add-interface";
import { TypeScriptSource } from "./typescript-source";
import { FractureComponent } from "../../core/component";
import { formatStringByNamingStrategy } from "../../core/naming-strategy";
import { Service } from "../../core/service";
import { Shape } from "../../model";

export class TypeScriptShape extends FractureComponent {
  public readonly service: Service;

  constructor(service: Service, shape: Shape) {
    super(service.fracture);

    this.service = service;

    const fileName = formatStringByNamingStrategy(
      shape.name,
      this.fracture.namingStrategy.ts.file
    );
    const tsShape = new TypeScriptSource(this.service, `shapes/${fileName}.ts`);

    // shape definition as an interface.
    addInterface(tsShape, shape);

    // CRUD commands
    addCreateCommand(shape);
  }

  // public preSynthesize() {
  //   /**
  //    * Crerate index file and import all shape types.
  //    */
  //   const indexFile = new TypeScriptSource(this.fracture, `/types/index.ts`);
  //   this.fracture.shapes.forEach((e) => {
  //     indexFile.line(`export * from "./${e.name}";`);
  //   });

  //   /**
  //    * Generate types for each shape.
  //    */
  //   this.fracture.shapes.forEach((e) => {
  //     // generate types for this shape
  //     const tsFile = new TypeScriptSource(this.fracture, `/types/${e.name}.ts`);

  //     /*************************************************************************
  //      *  INTERFACE / OUTPUT
  //      ************************************************************************/

  //     // generate helpful comments
  //     tsFile.line(`/**`);
  //     e.comment.forEach((c) => tsFile.line(` * ${c}`));
  //     tsFile.line(` */`);

  //     // build interface
  //     tsFile.open(`export interface ${e.name} {`);
  //     e.attributes.forEach((a) => {
  //       // generate helpful comments
  //       tsFile.line(`/**`);
  //       a.comment.forEach((c) => tsFile.line(` * ${c}`));
  //       tsFile.line(` */`);
  //       // console.log(a);

  //       // write type definition
  //       const q = a.isRequired ? "" : "?";
  //       tsFile.line(`${a.name}${q}: ${a.typeScriptType};`);
  //     });
  //     tsFile.close(`}`);
  //     tsFile.line("\n");

  //     /*************************************************************************
  //      *  INPUT DATA
  //      ************************************************************************/

  //     // build interface
  //     tsFile.open(
  //       `export interface ${e.name}${this.commandLabels.inputDataLabel} {`
  //     );
  //     e.dataShapeAttributes.forEach((a) => {
  //       const q = a.isRequired ? "" : "?";
  //       tsFile.line(`${a.name}${q}: ${a.typeScriptType};`);
  //     });
  //     tsFile.close(`}`);
  //     tsFile.line("\n");

  //     /*************************************************************************
  //      *  CREATE INPUT
  //      ************************************************************************/

  //     tsFile.open(
  //       `export interface ${this.crudLabels.createLabel}${e.name}${this.commandLabels.commandInputLabel} {`
  //     );
  //     const createName = formatLabel(
  //       e.name,
  //       this.namingStrategy.attributeStrategy
  //     );
  //     tsFile.line(
  //       `${createName}${this.commandLabels.inputDataLabel}: ${e.name}${this.commandLabels.inputDataLabel};`
  //     );
  //     tsFile.close(`}`);
  //     tsFile.line("\n");

  //     /*************************************************************************
  //      *  READ INPUT
  //      ************************************************************************/

  //     tsFile.open(
  //       `export interface ${this.crudLabels.readLabel}${e.name}${this.commandLabels.commandInputLabel} {`
  //     );
  //     e.keyShapeAttributes.forEach((a) => {
  //       // write type definition
  //       const q = a.isRequired ? "" : "?";
  //       tsFile.line(`${a.name}${q}: ${a.typeScriptType};`);
  //     });
  //     tsFile.close(`}`);
  //     tsFile.line("\n");

  //     /*************************************************************************
  //      *  UPDATE INPUT
  //      ************************************************************************/

  //     tsFile.open(
  //       `export interface ${this.crudLabels.updateLabel}${e.name}${this.commandLabels.commandInputLabel} {`
  //     );
  //     e.keyShapeAttributes.forEach((a) => {
  //       // write type definition
  //       const q = a.isRequired ? "" : "?";
  //       tsFile.line(`${a.name}${q}: ${a.typeScriptType};`);
  //     });
  //     const updateName = formatLabel(
  //       e.name,
  //       this.namingStrategy.attributeStrategy
  //     );
  //     tsFile.line(
  //       `${updateName}${this.commandLabels.inputDataLabel}: ${e.name}${this.commandLabels.inputDataLabel};`
  //     );
  //     tsFile.close(`}`);
  //     tsFile.line("\n");

  //     /*************************************************************************
  //      *  DELETE INPUT
  //      ************************************************************************/

  //     tsFile.open(
  //       `export interface ${this.crudLabels.deleteLabel}${e.name}${this.commandLabels.commandInputLabel} {`
  //     );
  //     e.keyShapeAttributes.forEach((a) => {
  //       // write type definition
  //       const q = a.isRequired ? "" : "?";
  //       tsFile.line(`${a.name}${q}: ${a.typeScriptType};`);
  //     });
  //     tsFile.close(`}`);
  //     tsFile.line("\n");

  //     /*************************************************************************
  //      *  LIST INPUT
  //      ************************************************************************/

  //     tsFile.open(
  //       `export interface ${this.crudLabels.listLabel}${e.name}${this.commandLabels.commandInputLabel} {`
  //     );
  //     e.listShapeAttributes.forEach((a) => {
  //       // write type definition
  //       const q = a.isRequired ? "" : "?";
  //       tsFile.line(`${a.name}${q}: ${a.typeScriptType};`);
  //     });
  //     tsFile.close(`}`);
  //     tsFile.line("\n");

  //     /*************************************************************************
  //      *  Outputs
  //      ************************************************************************/

  //     tsFile.open(
  //       `export interface ${this.crudLabels.createLabel}${e.name}${this.commandLabels.commandOutputLabel} {`
  //     );
  //     const outputName = formatLabel(
  //       e.name,
  //       this.namingStrategy.attributeStrategy
  //     );
  //     tsFile.line(`${outputName}: ${e.name};`);
  //     tsFile.close(`}`);
  //     tsFile.line("\n");
  //   });

  //   // close up index file
  //   indexFile.line("\n");
  // }
}
