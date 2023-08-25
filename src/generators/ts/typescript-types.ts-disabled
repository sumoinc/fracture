import { join } from "path";
import { TypeScriptSource } from "./typescript-source";
import { Structure } from "../../core";
import { Service } from "../../core/fracture-service";

export class TypescriptTypes extends TypeScriptSource {
  public readonly service: Service;

  constructor(service: Service) {
    super(service, join(service.srcDir, "ts", "types", service.name + ".ts"));
    this.service = service;
  }

  preSynthesize(): void {
    /***************************************************************************
     * GENERIC TYPES
     **************************************************************************/

    this.open(`export type Error = {`);
    this.line(`code: number;`);
    this.line(`source: string;`);
    this.line(`message: string;`);
    this.line(`detail: string;`);
    this.close(`};`);
    this.line("\n");

    this.open(`export type ${this.service.tsResponseTypeName}<T> = {`);
    this.line(`data?: T;`);
    this.line(`errors: Error[];`);
    this.line(`status: number;`);
    this.close(`};`);
    this.line("\n");

    this.open(`export type ${this.service.tsLlistResponseTypeName}<T> = {`);
    this.line(`data?: T[];`);
    this.line(`errors: Error[];`);
    this.line(`status: number;`);
    this.close(`};`);
    this.line("\n");

    /***************************************************************************
     * STRUCTURE CLOSURE
     **************************************************************************/

    const writeInterface = (structure: Structure) => {
      this.comments(structure.comments);
      this.open(`export interface ${structure.tsInterfaceName} {`);
      structure.publicAttributes.forEach((attribute) => {
        this.comments(attribute.comments);
        this.line(
          `${attribute.tsAttributeName}${attribute.tsRequired}: ${attribute.tsType};`
        );
      });
      this.close(`}`);
      this.line("");
    };

    /***************************************************************************
     * RESOURCE SHAPE
     **************************************************************************/

    this.service.resources.forEach((resource) => {
      resource.structures.forEach((structure) => writeInterface(structure));
    });

    /***************************************************************************
     * INPUTS / OUTPUTS
     **************************************************************************/
    this.service.resources.forEach((resource) => {
      resource.accessPatterns.forEach((accessPattern) => {
        accessPattern.operations.forEach((operation) => {
          writeInterface(operation.inputStructure);
          writeInterface(operation.outputStructure);
        });
      });
    });

    super.preSynthesize();
  }
}
