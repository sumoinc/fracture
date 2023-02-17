import { Component, Project } from "projen";
import { ValueOf } from "type-fest";
import { FractureComponent } from "./component";
import { ApiGateway } from "../generators/api/api-gateway/api-gateway";
import { AppSync } from "../generators/api/app-sync/app-sync";
import { Entity, EntityOptions } from "../model";
import { TypeScript } from "../generators/typescript/typescript";

export interface FractureOptions {
  /**
   * Directory where generated code will be placed.
   */
  gendir?: string;
  /**
   * Enable AppSync for your application.
   *
   * @default true
   */
  appsync?: boolean;
  /**
   * Enable Api Gateway for your application.
   *
   * @default true
   */
  apigateway?: boolean;
}

export const NamingStrategyType = {
  PASCAL_CASE: "pascalCase",
  CAMEL_CASE: "camelCase",
} as const;

export interface NamingStrategy {
  entityStrategy: ValueOf<typeof NamingStrategyType>;
  attributeStrategy: ValueOf<typeof NamingStrategyType>;
}

/**
 * The root of the entire application.
 */
export class Fracture extends Component {
  public readonly project: Project;
  public readonly namespace: string;
  public readonly gendir: string;
  public readonly appsync: boolean;
  public readonly apigateway: boolean;
  public readonly namingStrategy: NamingStrategy;

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
    this.gendir = options.gendir ?? project.outdir;
    this.appsync = options.appsync ?? true;
    this.apigateway = options.apigateway ?? true;
    this.namingStrategy = {
      attributeStrategy: NamingStrategyType.CAMEL_CASE,
      entityStrategy: NamingStrategyType.PASCAL_CASE,
    };

    /***************************************************************************
     * 
     *  CODE GENERATION
     * 
     **************************************************************************/

    // typescript type generation
    new TypeScript(this);

    // if appsync's enabled, set it up
    if (this.appsync) {
      new AppSync(this);
    }

    // if api gateway's enabled, set it up
    if (this.apigateway) {
      new ApiGateway(this);
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
