import { join } from "path";
import { Fracture, FractureComponent } from ".";
import { AuditStrategy } from "./audit-strategy";
import { PartitionKeyStrategy } from "./partition-key-strategy";
import { TypeStrategy } from "./type-strategy";
import { VersioningStrategy } from "./versioning-strategy";
import { Table } from "../dynamodb/table";
import { Shape, ShapeOptions } from "../model";
import { EnumShape, EnumShapeOptions } from "../model/enum";

export interface ServiceOptions {
  name: string;
  /**
   * The type strategy to use for the partition key.
   */
  partitionKeyStrategy?: PartitionKeyStrategy;
  /**
   * Versioned.
   * @default fracture default
   */
  versioned?: boolean;
  /**
   * The versioning strategy to use for generated code.
   */
  versioningStrategy?: VersioningStrategy;
  /**
   * The type strategy to use for generated code.
   */
  typeStrategy?: TypeStrategy;
  /**
   * The audit strategy to use for generated code.
   */
  auditStrategy?: AuditStrategy;
}

export class Service extends FractureComponent {
  public readonly name: string;
  public readonly outdir: string;
  public readonly partitionKeyStrategy: PartitionKeyStrategy;
  public readonly versioned: boolean;
  public readonly versioningStrategy: VersioningStrategy;
  public readonly typeStrategy: TypeStrategy;
  public readonly auditStrategy: AuditStrategy;
  public readonly dynamodb: Table;

  constructor(fracture: Fracture, options: ServiceOptions) {
    super(fracture);

    this.name = options.name;
    this.outdir = join(fracture.outdir, this.name);
    this.partitionKeyStrategy =
      options.partitionKeyStrategy ?? fracture.partitionKeyStrategy;
    this.versioned = options.versioned ?? fracture.versioned;
    this.versioningStrategy =
      options.versioningStrategy ?? fracture.versioningStrategy;
    this.typeStrategy = options.typeStrategy ?? fracture.typeStrategy;
    this.auditStrategy = options.auditStrategy ?? fracture.auditStrategy;

    // each service gets it's own dynamodb table
    this.dynamodb = new Table(this, { name: this.name });

    /***************************************************************************
     *
     *  CODE GENERATION
     *
     *  Generate code for various services.
     *
     **************************************************************************/

    //new TypeScriptModel(this);
    //new AppSync(this);
    //new ApiGateway(this);
  }

  /**
   * Get all shapes for this service.
   */
  public get shapes(): Shape[] {
    const isShape = (c: FractureComponent): c is Shape =>
      c instanceof Shape &&
      c.namespace === this.namespace &&
      c.service.name === this.name;
    return (this.project.components as FractureComponent[]).filter(isShape);
  }

  public addShape(options: ShapeOptions) {
    return new Shape(this, options);
  }

  /**
   * Get all enums for this service.
   */
  public get enumShapes(): Shape[] {
    const isShape = (c: FractureComponent): c is Shape =>
      c instanceof EnumShape &&
      c.namespace === this.namespace &&
      c.service.name === this.name;
    return (this.project.components as FractureComponent[]).filter(isShape);
  }

  public addEnum(options: EnumShapeOptions) {
    return new EnumShape(this, options);
  }
}
