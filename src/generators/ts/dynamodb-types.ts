import { buildMarshalledTypes } from "./factories/build-marshalled-types";
import { buildUnmarshalledTypes } from "./factories/build-unmarshalled-types";
import { printNodes } from "./factories/print-nodes";
import { Service } from "../../services/service";
import { Structure } from "../../services/structure";
import { GeneratedTypescriptFile } from "../generated-typescript-file";

export class DynamoDbTypes extends GeneratedTypescriptFile {
  constructor(public readonly project: Service) {
    super(project, "dynamodb-types.ts");
  }

  preSynthesize(): void {
    super.preSynthesize();

    // persistant types
    const persistantStructures = Structure.all(this.project).filter(
      (structure) => structure.persistant
    );

    buildMarshalledTypes({
      service: this.project,
      structures: persistantStructures,
    }).forEach((type) => {
      this.addLine(printNodes([type]));
    });

    buildUnmarshalledTypes({
      service: this.project,
      structures: persistantStructures,
    }).forEach((type) => {
      this.addLine(printNodes([type]));
    });
  }
}
