import { TypeScriptSource, TypeScriptSourceOptions } from "./typescript-source";
import { Fracture } from "../../core";
import { FractureService } from "../../core/fracture-service";

export interface TypescriptServiceTypesOptions extends TypeScriptSourceOptions {
  /**
   * The service we're generating types for.
   */
  service: FractureService;
}

export class TypescriptServiceTypes extends TypeScriptSource {
  /**
   * The service we're generating types for.
   */
  public readonly service: FractureService;

  constructor(
    fracture: Fracture,
    filePath: string,
    options: TypescriptServiceTypesOptions
  ) {
    super(fracture, filePath, options);

    /***************************************************************************
     * Props
     **************************************************************************/

    this.service = options.service;

    /***************************************************************************
     *
     * DYNAMODB COMMANDS PACKAGE FILE
     *
     * We create this package.json file to make sure cruft and extra packages
     * from lower package files aren't packaged up with the commands.
     *
     **************************************************************************/

    /* comment out for now, some dependancies need to be managed here.
    new JsonFile(this.project, join(this.dynamoCommandDir, "package.json"), {
      obj: {
        name: `${this.service.name}-service-dynamodb-commands`,
        version: "0.0.1",
        private: true,
        dependencies: {},
      },
      newline: true,
      committed: true,
    });
    */

    // CDK app componants
  }

  synthesize(): void {
    /***************************************************************************
     * Common Types
     **************************************************************************/

    this.open(`export type Error = {`);
    this.line(`code: number;`);
    this.line(`source: string;`);
    this.line(`message: string;`);
    this.line(`detail: string;`);
    this.close(`}`);
    this.line("");

    this.open(`export type ${this.strategy.formatTypeName("response")}<T> = {`);
    this.line(`data?: T;`);
    this.line(`errors: Error[];`);
    this.line(`status: number;`);
    this.close(`}`);
    this.line("");

    this.open(
      `export type ${this.strategy.formatTypeName("list-response")}<T> = {`
    );
    this.line(`data?: T[];`);
    this.line(`errors: Error[];`);
    this.line(`status: number;`);
    this.close(`}`);
    this.line("");

    super.synthesize();
  }
}
