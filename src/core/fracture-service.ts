import { join } from "path";
import { paramCase } from "change-case";
import { NodePackageManager } from "projen/lib/javascript";
import {
  TypeScriptProject,
  TypeScriptProjectOptions,
} from "projen/lib/typescript";
import { Fracture } from "./fracture";
import { Resource, ResourceOptions } from "./resource";
import { Structure, StructureOptions } from "./structure";
import { StructureAttributeType } from "./structure-attribute";
import { DynamoTable } from "../dynamodb";
import { TypescriptTypes } from "../generators";
import {
  TypescriptStrategy,
  TypescriptStrategyOptions,
} from "../generators/ts/strategy";

export interface FractureServiceOptions
  extends Partial<TypeScriptProjectOptions> {
  /**
   * A name for the service
   */
  name: string;
  /**
   * Typescript strategy options
   *
   * @default fracture defaults
   */
  typescriptStrategyOptions?: TypescriptStrategyOptions;
  /**
   * Options for resources to add when initializing the service.
   */
  resourceOptions?: ResourceOptions[];
  // srcDir?: string;
  /**
   * Logging options
   * @default LogLevel.INFO
   */
  //logging?: LoggerOptions;
  /**
   * Versioned.
   * @default false
   */
  //isVersioned?: boolean;
  /**
   * The naming strategy to use for generated code.
   */
  // namingStrategy?: NamingStrategy;
  /**
   * The audit strategy to use for generated code.
   */
  //auditStrategy?: AuditStrategy;
}

export class FractureService extends TypeScriptProject {
  /**
   * A name for the service.
   */
  public readonly name: string;
  /**
   * Defines typescript naming conventions for this service.
   */
  public readonly typescriptStrategy: TypescriptStrategy;
  /**
   * All resourcers in this service.
   */
  public resources: Resource[] = [];
  /**
   * Table defnition for the table that supports this service.
   */
  public readonly dynamoTable: DynamoTable;
  /**
   * All structures for this service.
   */
  public structures: Structure[] = [];
  public readonly errorStructure: Structure;
  public readonly responseStructure: Structure;
  public readonly listResponseStructure: Structure;

  constructor(fracture: Fracture, options: FractureServiceOptions) {
    /***************************************************************************
     * Projen Props
     **************************************************************************/

    // ensure name is param-cased for outdir
    const outdir = join(fracture.serviceRoot, paramCase(options.name));

    const projenOptions: TypeScriptProjectOptions = {
      name: options.name,
      defaultReleaseBranch: "main",
      parent: fracture,
      packageManager: NodePackageManager.PNPM,
      pnpmVersion: "8",
      outdir,
      eslintOptions: {
        dirs: ["src"],
        tsconfigPath: "./**/tsconfig.dev.json",
      },
      licensed: false,
      projenrcTs: true,
    };

    super(projenOptions);

    /***************************************************************************
     * Props
     **************************************************************************/

    this.name = options.name;
    this.typescriptStrategy = new TypescriptStrategy(this);

    /***************************************************************************
     * Dynamo Configuration
     **************************************************************************/

    this.dynamoTable = new DynamoTable(this, { name: this.name });

    /***************************************************************************
     * Initialize standard structures
     **************************************************************************/

    this.errorStructure = this.addStructure({
      name: `error`,
      attributeOptions: [
        {
          name: `code`,
          type: StructureAttributeType.INT,
        },
        {
          name: `source`,
        },
        {
          name: `message`,
        },
        {
          name: `detail`,
        },
      ],
    });

    this.responseStructure = this.addStructure({
      name: `response`,
      typeParameter: `T`,
      attributeOptions: [
        {
          name: `data`,
          type: StructureAttributeType.CUSTOM,
          typeParameter: `T`,
          required: false,
        },
        {
          name: `errors`,
          type: StructureAttributeType.ARRAY,
          typeParameter: `error`,
        },
        {
          name: `status`,
          type: StructureAttributeType.INT,
        },
      ],
    });

    this.listResponseStructure = this.addStructure({
      name: `list-response`,
      typeParameter: `T`,
      attributeOptions: [
        {
          name: `data`,
          type: StructureAttributeType.ARRAY,
          typeParameter: `T`,
          required: false,
        },
        {
          name: `errors`,
          type: StructureAttributeType.ARRAY,
          typeParameter: `error`,
        },
        {
          name: `status`,
          type: StructureAttributeType.INT,
        },
      ],
    });

    /***************************************************************************
     * Resources based on options
     **************************************************************************/

    if (options.resourceOptions) {
      options.resourceOptions.forEach((resourceOption) => {
        this.addResource(resourceOption);
      });
    }
  }

  public addResource(options: ResourceOptions) {
    const resource = new Resource(this, options);
    this.resources.push(resource);
    return resource;
  }

  public addStructure(options: StructureOptions) {
    const structure = new Structure(this, options);
    this.structures.push(structure);
    return structure;
  }

  /*****************************************************************************
   *
   * Pre-synth
   *
   * We should have all our operations and attributes added now so it's safe to
   * start looping over them and preparing for codegen.
   *
   ****************************************************************************/
  preSynthesize(): void {
    super.preSynthesize();

    /***************************************************************************
     * Typescript Generators
     **************************************************************************/

    const tsRoot = join("generated", "ts");

    const typesFile = join(tsRoot, "types.ts");
    new TypescriptTypes(this, typesFile);
  }
}
