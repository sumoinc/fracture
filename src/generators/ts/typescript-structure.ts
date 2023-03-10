import { TypescriptResource } from "./typescript-resource";
import { TypescriptService } from "./typescript-service";
import { TypeScriptSource } from "./typescript-source";
import { TypescriptStructureAttribute } from "./typescript-structure-attribute";
import { FractureComponent } from "../../core";
import { formatStringByNamingStrategy } from "../../core/naming-strategy";
import { Resource } from "../../core/resource";
import { Service } from "../../core/service";
import { Structure } from "../../core/structure";

export class TypescriptStructure extends FractureComponent {
  public readonly structure: Structure;
  public readonly tsResource: TypescriptResource;

  constructor(tsResource: TypescriptResource, structure: Structure) {
    super(structure.fracture);

    this.structure = structure;
    this.tsResource = tsResource;

    this.writePublicInterface(this.tsService.typeFile);
    this.writePrivateInterface(this.tsService.typeFile);
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
      const r = a.isRequired ? "" : "?";
      file.lines(a.comments);
      file.line(`${a.attributeName}${r}: ${a.typescriptType};`);
    });
    file.close(`}`);
    file.line("\n");
  }

  writePrivateInterface(file: TypeScriptSource) {
    file.open(`export interface ${this.privateInterfaceName} {`);
    this.privateAttributes.forEach((a) => {
      file.line(`${a.attributeShortName}?: ${a.typescriptType};`);
    });
    file.close(`}`);
    file.line("\n");
  }

  public get tsService(): TypescriptService {
    return this.tsResource.tsService;
  }

  public get service(): Service {
    return this.structure.service;
  }

  public get resource(): Resource {
    return this.structure.resource;
  }
}
