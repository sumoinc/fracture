import { Component, Project } from "projen";
import { FractureComponent } from "./component";
import { ApiGateway } from "../api/api-gateway/api-gateway";
import { AppSync } from "../api/app-sync/app-sync";
import { Entity, EntityOptions } from "../model";

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

/**
 * The root of the entire application.
 */
export class Fracture extends Component {
  public readonly project: Project;
  public readonly namespace: string;
  public readonly gendir: string;
  public readonly appsync: boolean;
  public readonly apigateway: boolean;

  constructor(
    project: Project,
    namespace: string = "fracture",
    options: FractureOptions = {}
  ) {
    super(project);

    this.project = project;
    this.namespace = namespace;
    this.gendir = options.gendir ?? project.outdir;
    this.appsync = options.appsync ?? true;
    this.apigateway = options.apigateway ?? true;

    // if appsync's enabled, set it up
    if (this.appsync) {
      new AppSync(this);
    }

    // if api gateway's enabled, set it up
    if (this.apigateway) {
      new ApiGateway(this);
    }
  }

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
