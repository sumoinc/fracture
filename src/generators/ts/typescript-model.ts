import { TypeScriptEntity } from "./typescript-entity";
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
     * Crerate index file and import all entity types.
     */
    const indexFile = new TypeScriptSource(this.service, `types/index.ts`);
    this.fracture.entities.forEach((e) => {
      indexFile.line(`export * from "./${e.name}";`);
    });
    indexFile.line("\n");

    /**
     * Generate types for each entity.
     */
    this.fracture.entities.forEach((e) => {
      new TypeScriptEntity(this.service, e);
    });
  }
}
