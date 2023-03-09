import { join } from "path";
import { TypescriptOperation } from "./typescript-operation";
import { TypescriptResourceAttribute } from "./typescript-resource-attribute";
import { TypescriptService } from "./typescript-service";
import { FractureComponent } from "../../core";
import { formatStringByNamingStrategy } from "../../core/naming-strategy";
import { Resource } from "../../core/resource";

export class TypescriptResource extends FractureComponent {
  public readonly resource: Resource;
  public readonly outdir: string;
  public readonly tsService: TypescriptService;
  public readonly tsAttributes: TypescriptResourceAttribute[] = [];
  public readonly tsOperations: TypescriptOperation[] = [];

  constructor(tsService: TypescriptService, resource: Resource) {
    super(resource.fracture);

    this.tsService = tsService;
    this.resource = resource;
    this.outdir = join(this.tsService.outdir, this.resource.name);

    // add attributes
    this.resource.attributes.forEach((attribute) => {
      this.tsAttributes.push(new TypescriptResourceAttribute(attribute));
    });

    // add operations
    this.resource.operations.forEach((operation) => {
      this.tsOperations.push(new TypescriptOperation(this, operation));
    });

    /***************************************************************************
     * TYPES
     **************************************************************************/
    const typeFile = this.tsService.typeFile;

    /**
     * Build this resource's interface.
     */
    typeFile.lines(this.comment);
    typeFile.open(`export interface ${this.interfaceName} {`);
    this.tsAttributes.forEach((attribute) => {
      typeFile.lines(attribute.comment);
      typeFile.line(
        `${attribute.attributeName}${attribute.required}: ${attribute.type};`
      );
    });
    typeFile.close(`}`);
    typeFile.line("\n");

    /**
     * Build dynamo specific interface.
     */
    typeFile.open(
      `export interface ${this.resource.interfaceNameDynamo} extends ${this.tsService.dynamoKeyName} {`
    );
    this.tsAttributes.forEach((attribute) => {
      typeFile.lines(attribute.comment);
      typeFile.line(
        `${attribute.attributeShortName}${attribute.required}: ${attribute.type};`
      );
    });
    typeFile.close(`}`);
    typeFile.line("\n");
  }

  /**
   * Return a formatted comment for this resource
   */
  public get comment() {
    return [`/**`]
      .concat(this.resource.comment.map((c) => ` * ${c}`))
      .concat([` */`]);
  }

  /**
   * Gets formatted interface name for this resource
   */
  public get interfaceName() {
    return formatStringByNamingStrategy(
      this.resource.name,
      this.fracture.namingStrategy.ts.interfaceName
    );
  }

  /**
   * Gets formatted dynamo interface name for this resource
   */
  public get interfaceNameForDynamo() {
    return formatStringByNamingStrategy(
      `dynamo-${this.resource.name}`,
      this.fracture.namingStrategy.ts.interfaceName
    );
  }

  /**
   * Gets formatted typename for this resource
   */
  public get typeName() {
    return formatStringByNamingStrategy(
      this.resource.name,
      this.fracture.namingStrategy.ts.typeName
    );
  }
}
