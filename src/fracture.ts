import { Project } from 'projen';
import { AppSync } from './appsync/appsync';
import { FractureComponent } from './component';
import { Entity, EntityOptions } from './model';

export interface FractureOptions {
  /**
   * Directory where generated code will be placed.
   */
  gendir?: string;
  /**
   * Enable AppSync
   */
  appsync?: boolean;
}

export class Fracture extends FractureComponent {
  public readonly gendir: string;
  public readonly appsync: boolean;

  constructor(
    project: Project,
    namespace?: string,
    options: FractureOptions = {},
  ) {
    super(project, namespace ?? 'fracture' );

    this.gendir = options.gendir ?? project.outdir;
    this.appsync = options.appsync ?? true;

    if (this.appsync) {
      new AppSync(project, this.namespace, { gendir: this.gendir });
    }
  }

  /**
   * Get all entities in this project's namespace.
   */
  public get entities(): Entity[] {
    const isEntity = (c: FractureComponent): c is Entity => c instanceof Entity && c.namespace === this.namespace;
    return (this.project.components as FractureComponent[]).filter(isEntity);
  }

  public addEntity(options: EntityOptions) {
    return new Entity(this.project, this.namespace, options);
  }


}
