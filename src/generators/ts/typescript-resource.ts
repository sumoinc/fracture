import { FractureComponent } from "../../core/component";
import { Resource } from "../../core/resource";

export class TypescriptResource extends FractureComponent {
  public readonly resource: Resource;

  constructor(resource: Resource) {
    super(resource.fracture);

    this.resource = resource;

    this.project.logger.info(`TS:INIT Resource: "${this.resource.name}"`);
  }

  public build() {}
}
