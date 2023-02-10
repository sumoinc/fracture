import { Attribute, AttributeOptions } from './attribute';
import { FractureComponent } from '../core/component';
import { Fracture } from '../core/fracture';

export interface EntityOptions {
  /**
   *  Name for the Entity.
   */
  name: string;
}

export class Entity extends FractureComponent {
  public readonly name: string;

  constructor(
    fracture: Fracture,
    options : EntityOptions,
  ) {
    super(fracture);

    this.name = options.name.toLowerCase();
  }

  /**
   * Adds an attribute
   */
  public addAttribute(options: AttributeOptions) {
    new Attribute(this.fracture, options);
    return this;
  }

}
