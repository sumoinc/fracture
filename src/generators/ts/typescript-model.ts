import { TypeScriptResource } from "./typescript-shape";
import { TypeScriptSource } from "./typescript-source";
import { FractureComponent } from "../../core/component";
import { Service } from "../../core/service";

export class TypeScriptModel extends FractureComponent {
  public readonly service: Service;

  constructor(service: Service) {
    super(service.fracture);

    this.service = service;
  }

  public preSynthesize() {
    /**
     * Crerate index file and import all shape types.
     */
    const indexFile = new TypeScriptSource(this.service, `resources/index.ts`);
    this.service.resources.forEach((e) => {
      indexFile.line(`export * from "./${e.name}";`);
    });
    indexFile.line("\n");

    /**
     * Generate types for each shape.
     */
    this.service.resources.forEach((e) => {
      new TypeScriptResource(e);
    });
  }
}
