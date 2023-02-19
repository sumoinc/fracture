import { Component, Project } from "projen";
import { ValueOf } from "type-fest";
import { FractureComponent } from "./component";
import { ApiGateway } from "../generators/api/api-gateway/api-gateway";
import { AppSync } from "../generators/api/app-sync/app-sync";
import { TypeScript } from "../generators/typescript/typescript";
import { Entity, EntityOptions } from "../model";

export interface FractureOptions {
  /**
   * Directory where generated code will be placed.
   * @default project.outdir + "/" + namespace
   */
  outdir?: string;
  /**
   * Generate AppSync code for your application.
   *
   * @default true
   */
  appsync?: boolean;
  /**
   * Generate Api Gateway code for your application.
   *
   * @default true
   */
  apigateway?: boolean;
  /**
   * Generate TypeScript code for your application.
   *
   * @default true
   */
  typescript?: boolean;
}

export const NamingStrategyType = {
  /**
   * PascalCase
   */
  PASCAL_CASE: "pascalCase",
  /**
   * camelCase
   */
  CAMEL_CASE: "camelCase",
} as const;

export interface NamingStrategy {
  entityStrategy: ValueOf<typeof NamingStrategyType>;
  attributeStrategy: ValueOf<typeof NamingStrategyType>;
}

export interface TypeScriptNamingStrategy {
  namingStrategy: NamingStrategy;
  commandNamingStrategy: CommandNamingStrategy;
  crudNamingStrategy: CrudNamingStrategy;
}

export interface CommandNamingStrategy {
  inputDataLabel: string;
  commandLabel: string;
  commandInputLabel: string;
  commandOutputLabel: string;
}

export interface CrudNamingStrategy {
  createLabel: string;
  readLabel: string;
  updateLabel: string;
  deleteLabel: string;
  listLabel: string;
  importLabel: string;
}

/**
 * The root of the entire application.
 */
export class Fracture extends Component {
  public readonly project: Project;
  public readonly namespace: string;
  public readonly outdir: string;
  public readonly appsync: boolean;
  public readonly apigateway: boolean;
  public readonly typescript: boolean;
  public readonly typeScriptNamingStrategy: TypeScriptNamingStrategy;

  constructor(
    project: Project,
    namespace: string = "fracture",
    options: FractureOptions = {}
  ) {
    super(project);

    /***************************************************************************
     *
     *  INIT FRACTURE PROJECT
     *
     **************************************************************************/

    this.project = project;
    this.namespace = namespace;
    this.outdir = (options.outdir ?? project.outdir) + "/" + namespace;
    this.appsync = options.appsync ?? true;
    this.apigateway = options.apigateway ?? true;
    this.typescript = options.typescript ?? true;
    this.typeScriptNamingStrategy = {
      namingStrategy: {
        attributeStrategy: NamingStrategyType.CAMEL_CASE,
        entityStrategy: NamingStrategyType.PASCAL_CASE,
      },
      commandNamingStrategy: {
        inputDataLabel: "Input",
        commandLabel: "Command",
        commandInputLabel: "CommandInput",
        commandOutputLabel: "CommandOutput",
      },
      crudNamingStrategy: {
        createLabel: "Create",
        readLabel: "Read",
        updateLabel: "Update",
        deleteLabel: "Delete",
        listLabel: "List",
        importLabel: "Import",
      },
    };

    /***************************************************************************
     *
     *  CODE GENERATION
     *
     *  Generate code based on flag inputs.
     *
     **************************************************************************/

    if (this.appsync) {
      new AppSync(this);
    }

    if (this.apigateway) {
      new ApiGateway(this);
    }

    // typescript type generation
    if (this.typescript) {
      new TypeScript(this);
    }
  }

  /*****************************************************************************
   *
   *  GETTERS / HELPERS
   *
   ****************************************************************************/

  /**
   * Get all entities in this project's namespace.
   */
  public get entities(): Entity[] {
    const isEntity = (c: FractureComponent): c is Entity =>
      c instanceof Entity && c.namespace === this.namespace;
    return (this.project.components as FractureComponent[]).filter(isEntity);
  }

  public addEntity(options: EntityOptions) {
    return new Entity(this, options);
  }
}
