import { TypeScriptSource } from "./typescript-source";
import { TypescriptStructureAttribute } from "./typescript-structure-attribute";
import { FractureComponent } from "../../core";
import { formatStringByNamingStrategy } from "../../core/naming-strategy";
import { Resource } from "../../core/resource";
import { Structure } from "../../core/structure";

export class TypescriptStructure extends FractureComponent {
  public readonly structure: Structure;
  public readonly resource: Resource;

  constructor(structure: Structure) {
    super(structure.fracture);

    this.structure = structure;
    this.resource = structure.resource;
  }

  public get comments() {
    return [`/**`]
      .concat(this.structure.options.comments.map((c) => ` * ${c}`))
      .concat([` */`]);
  }

  public get privateInterfaceName() {
    return formatStringByNamingStrategy(
      this.structure.name + "-dynamo",
      this.fracture.options.namingStrategy.ts.interfaceName
    );
  }

  public get publicInterfaceName() {
    return formatStringByNamingStrategy(
      this.structure.name,
      this.fracture.options.namingStrategy.ts.interfaceName
    );
  }

  public get privateAttributes() {
    return this.structure.privateAttributes.map((attribute) => {
      return new TypescriptStructureAttribute(this, attribute);
    });
  }

  public get publicAttributes() {
    return this.structure.publicAttributes.map((attribute) => {
      return new TypescriptStructureAttribute(this, attribute);
    });
  }

  writePublicInterface(file: TypeScriptSource) {
    file.lines(this.comments);
    file.open(`export interface ${this.publicInterfaceName} {`);
    this.publicAttributes.forEach((a) => {
      file.lines(a.comments);
      file.line(`${a.attributeName}?: ${a.typescriptType};`);
    });
    file.close(`}`);
    file.line("\n");
  }

  writePrivateInterface(file: TypeScriptSource) {
    file.open(`interface ${this.privateInterfaceName} {`);
    this.privateAttributes.forEach((a) => {
      file.line(`${a.attributeShortName}?: ${a.typescriptType};`);
    });
    file.close(`}`);
    file.line("\n");
  }
}
