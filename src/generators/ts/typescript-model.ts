import { TypeScriptEntity } from "./typescript-entity";
import { TypeScriptSource } from "./typescript-source";
import { FractureComponent } from "../../core/component";
import {
  CommandNamingStrategy,
  CrudNamingStrategy,
  Fracture,
  NamingStrategy,
} from "../../core/fracture";

export class TypeScriptModel extends FractureComponent {
  public readonly namingStrategy: NamingStrategy;
  public readonly commandLabels: CommandNamingStrategy;
  public readonly crudLabels: CrudNamingStrategy;

  constructor(fracture: Fracture) {
    super(fracture);

    const ns = fracture.typeScriptNamingStrategy;
    this.namingStrategy = ns.namingStrategy;
    this.commandLabels = ns.commandNamingStrategy;
    this.crudLabels = ns.crudNamingStrategy;
  }

  public preSynthesize() {
    /**
     * Crerate index file and import all entity types.
     */
    const indexFile = new TypeScriptSource(this.fracture, `/types/index.ts`);
    this.fracture.entities.forEach((e) => {
      indexFile.line(`export * from "./${e.name}";`);
    });
    indexFile.line("\n");

    /**
     * Generate types for each entity.
     */
    this.fracture.entities.forEach((e) => {
      new TypeScriptEntity(this.fracture, e);
    });
  }
}