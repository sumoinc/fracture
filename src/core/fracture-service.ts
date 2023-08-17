import { join } from "path";
import { paramCase } from "change-case";
import { NodePackageManager } from "projen/lib/javascript";
import {
  TypeScriptProject,
  TypeScriptProjectOptions,
} from "projen/lib/typescript";
import { Fracture } from "./fracture";
import { Resource, ResourceOptions } from "./resource";
import { TypescriptServiceTypes } from "../generators/ts/typescript-service-types";

export interface FractureServiceOptions
  extends Partial<TypeScriptProjectOptions> {
  /**
   * A name for the service
   */
  name: string;
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
   * All resourcers in this service.
   */
  public resources: Resource[] = [];

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
    };

    super(projenOptions);

    /***************************************************************************
     * Props
     **************************************************************************/

    this.name = options.name;

    /***************************************************************************
     * Typescript Generators
     **************************************************************************/

    const typesFile = join(outdir, "generated", "ts", "types.ts");

    new TypescriptServiceTypes(fracture, typesFile, {
      service: this,
    });
  }

  public addResource(options: ResourceOptions) {
    const fracture = this.parent as Fracture;
    const resource = new Resource(fracture, options);
    this.resources.push(resource);
    return resource;
  }

  //   /***************************************************************************
  //    *
  //    * CREATE PACKAGE SUB-PROJECT
  //    *
  //    * This powers a sub-project to house all generated code as a package. This
  //    * is mostly generated code and should not be touched by devs unless really
  //    * needed.
  //    *
  //    **************************************************************************/

  //   const project = new TypeScriptProject({
  //     defaultReleaseBranch: "main",
  //     name: this.packageName,
  //     parent: fracture,
  //     licensed: false,
  //     outdir: join(fracture.packageRoot, mergedOptions.name),
  //     packageManager: NodePackageManager.PNPM,
  //     pnpmVersion: "8",
  //     prettier: true,
  //     projenrcTs: true,
  //     deps: [
  //       "@aws-sdk/client-dynamodb",
  //       "@aws-sdk/lib-dynamodb",
  //       "aws-cdk",
  //       "aws-cdk-lib",
  //       "constructs",
  //       "uuid",
  //     ],

  //     devDeps: ["@types/uuid"],
  //     eslintOptions: {
  //       dirs: ["src"],
  //       tsconfigPath: "./**/tsconfig.dev.json",
  //     },
  //   });
  //   this.project = project;

  //   /***************************************************************************
  //    *
  //    * INIT SERVICE
  //    *
  //    **************************************************************************/

  //   this.fracture.logger.info("-".repeat(80));
  //   this.fracture.logger.info(`INIT Service: "${this.name}"`);
  //   this.fracture.logger.info("-".repeat(80));

  //   // inverse
  //   this.fracture.services.push(this);

  //   /***************************************************************************
  //    *
  //    * DYNAMO TABLE
  //    *
  //    * Add dynamo table per options defined in service definition
  //    *
  //    **************************************************************************/

  //   this.dynamoTable = new DynamoTable(this);

  //   // add Dynalite support for Jest tests
  //   this.dynaliteSupport = new DynaliteSupport(this);

  //   /***************************************************************************
  //    *
  //    * GENERATORS
  //    *
  //    **************************************************************************/

  //   //this.ts = new TypescriptService(this);

  //   this.tsTypes = new TypescriptTypes(this);
  //   this.cdkApp = new CdkApp(this);

  //   return this;
  // }

  // public get name(): string {
  //   return this.options.name;
  // }

  // public get packageName(): string {
  //   return `@${this.fracture.name}/${this.name}-pkg`;
  // }

  // public get serviceName(): string {
  //   return `@${this.fracture.name}/${this.name}-svc`;
  // }

  // public get isVersioned(): boolean {
  //   return this.options.isVersioned;
  // }

  // public get namingStrategy(): NamingStrategy {
  //   return this.options.namingStrategy;
  // }

  // public get auditStrategy() {
  //   return this.options.auditStrategy;
  // }

  // public get srcDir() {
  //   return this.options.srcDir;
  // }

  // public get serviceRoot() {
  //   return join(this.fracture.packageRoot, this.name);
  // }

  // /**
  //  * Returns index for this package in the overall project.
  //  * Useful when trying to split up ports for testing in parallel, etc.
  //  */
  // public get serviceIndex() {
  //   const { services } = this.fracture;
  //   return services.findIndex((p) => p.name === this.name) || 0;
  // }

  // /*****************************************************************************
  //  *
  //  *  Configuration Helpers
  //  *
  //  ****************************************************************************/

  // /**
  //  * Add a resource to the fracture project.
  //  *
  //  * @param {ResourceOptions}
  //  * @returns {Resource}
  //  */
  // public addResource(options: ResourceOptions) {
  //   return new Resource(this, options);
  // }

  // public get keyDynamoGsi(): DynamoGsi {
  //   return this.dynamoTable.keyDynamoGsi;
  // }

  // public get lookupDynamoGsi(): DynamoGsi {
  //   return this.dynamoTable.lookupDynamoGsi;
  // }

  // /*****************************************************************************
  //  *
  //  *  TYPESCRIPT HELPERS
  //  *
  //  ****************************************************************************/

  // public get tsResponseTypeName() {
  //   return formatStringByNamingStrategy(
  //     "response",
  //     this.namingStrategy.ts.typeName
  //   );
  // }

  // public get tsLlistResponseTypeName() {
  //   return formatStringByNamingStrategy(
  //     "list-response",
  //     this.namingStrategy.ts.typeName
  //   );
  // }
}
