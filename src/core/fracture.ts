import { Component, Project } from "projen";
import { ValueOf } from "type-fest";
import { FractureComponent } from "./component";
import { Account, AccountOptions } from "../aws/account";
import { Organization, OrganizationOptions } from "../aws/organization";
import { ApiGateway } from "../generators/api-gateway/api-gateway";
import { AppSync } from "../generators/app-sync/app-sync";
import { TypeScriptModel } from "../generators/ts/typescript-model";
import { Entity, EntityOptions } from "../model";

export interface FractureOptions {
  /**
   * Directory where generated code will be placed.
   * @default project.outdir + "/" + namespace
   */
  outdir?: string;
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
    this.outdir = options.outdir ?? namespace;
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
     *  Generate code for various services.
     *
     **************************************************************************/

    new TypeScriptModel(this);
    new AppSync(this);
    new ApiGateway(this);
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

  public addOrganization(options: OrganizationOptions) {
    new Organization(this, options);
    return this;
  }

  public addAccount(options: AccountOptions) {
    new Account(this, options);
    return this;
  }
}
