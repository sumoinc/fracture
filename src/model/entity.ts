import { Project } from 'projen';
import { Attribute, AttributeOptions } from './attribute';
import { FractureComponent } from '../component';

export interface EntityOptions {
  /**
   *  Name for the Entity.
   */
  name: string;
}

export class Entity extends FractureComponent {
  public readonly name: string;

  constructor(
    project: Project,
    namespace: string,
    options : EntityOptions,
  ) {
    super(project, namespace);

    this.name = options.name.toLowerCase();
  }

  /**
   * Adds an attribute
   */
  public addAttribute(options: AttributeOptions) {
    new Attribute(this.project, this.namespace, options);
    return this;
  }

}
