import { TypeScriptSource, TypeScriptSourceOptions } from "./typescript-source";
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
    service: FractureService,
    filePath: string,
    options: TypescriptServiceTypesOptions
  ) {
    super(service, filePath, options);

    /***************************************************************************
     * Props
     **************************************************************************/

    this.service = options.service;
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
