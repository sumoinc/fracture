import { join } from "path";
import { TypescriptOperation } from "./typescript-operation";
import { TypescriptResourceAttribute } from "./typescript-resource-attribute";
import { TypescriptService } from "./typescript-service";
import { FractureComponent } from "../../core";
import { formatStringByNamingStrategy } from "../../core/naming-strategy";
import { Resource } from "../../core/resource";

export class TypescriptResource extends FractureComponent {
  public readonly typescriptService: TypescriptService;
  public readonly resource: Resource;
  public readonly outdir: string;
  public readonly attributes: TypescriptResourceAttribute[] = [];
  public readonly operations: TypescriptOperation[] = [];

  constructor(typescriptService: TypescriptService, resource: Resource) {
    super(resource.fracture);

    this.typescriptService = typescriptService;
    this.resource = resource;
    this.outdir = join(this.fracture.outdir, this.resource.name);

    // add attributes
    this.resource.attributes.forEach((attribute) => {
      this.attributes.push(new TypescriptResourceAttribute(attribute));
    });

    // add operations
    this.resource.operations.forEach((operation) => {
      this.operations.push(new TypescriptOperation(operation));
    });

    /***************************************************************************
     * TYPES
     **************************************************************************/
    const typeFile = this.typescriptService.typeFile;

    /**
     * Build this resource's interface.
     */
    typeFile.lines(this.comment);
    typeFile.open(`export interface ${this.interfaceName} {`);
    this.attributes.forEach((attribute) => {
      typeFile.lines(attribute.comment);
      typeFile.line(
        `${attribute.attributeName}${attribute.required}: ${attribute.type};`
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
