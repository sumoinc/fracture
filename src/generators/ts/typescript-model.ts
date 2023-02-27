import { TypeScriptShape } from "./typescript-shape";
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
    const indexFile = new TypeScriptSource(this.service, `shapes/index.ts`);
    this.service.shapes.forEach((e) => {
      indexFile.line(`export * from "./${e.name}";`);
    });
    indexFile.line("\n");

    /**
     * Generate types for each shape.
     */
    this.service.shapes.forEach((e) => {
      new TypeScriptShape(this.service, e);
    });
  }
}
