import { Component } from "projen";
import { Resource } from "../../core/resource.ts-disabled";

export class TypescriptResource extends Component {
  public readonly resource: Resource;

  constructor(resource: Resource) {
    super(resource.project);

    this.resource = resource;

    this.project.logger.info(`TS:INIT Resource: "${this.resource.name}"`);
  }
}
