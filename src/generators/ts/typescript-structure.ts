import { TypescriptResource } from "./typescript-resource";
import { TypescriptResourceAttribute } from "./typescript-resource-attribute";
import { TypescriptService } from "./typescript-service";
import { TypeScriptSource } from "./typescript-source";
import { FractureComponent } from "../../core";
import { formatStringByNamingStrategy } from "../../core/naming-strategy";
import { Resource } from "../../core/resource";
import { Service } from "../../core/service";
import { Structure } from "../../core/structure";

export class TypescriptStructure extends FractureComponent {
  // parent
  public readonly tsResource: TypescriptResource;
  // source
  public readonly structure: Structure;

  constructor(tsResource: TypescriptResource, structure: Structure) {
    super(tsResource.fracture);

    this.tsResource = tsResource;
    this.structure = structure;

    this.project.logger.info(`TS:INIT Structure: "${this.structure.name}"`);

    this.writePublicInterface(this.tsService.typeFile);
  }

  public get comments() {
    return [`/**`]
      .concat(this.structure.options.comments.map((c) => ` * ${c}`))
      .concat([` */`]);
  }

  public get publicInterfaceName() {
    return formatStringByNamingStrategy(
      this.structure.name,
      this.fracture.options.namingStrategy.ts.interfaceName
    );
  }

  public get tsAttributes(): TypescriptResourceAttribute[] {
    return this.resource.attributes.map((attribute) => {
      return new TypescriptResourceAttribute(this.tsResource, attribute);
    });
  }

  public get tsPublicAttributes() {
    return this.tsAttributes;
  }

  writePublicInterface(file: TypeScriptSource) {
    file.lines(this.comments);
    file.open(`export interface ${this.publicInterfaceName} {`);
    this.tsPublicAttributes.forEach((a) => {
      file.lines(a.comments);
      file.line(`${a.attributeName}?: ${a.type};`);
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
