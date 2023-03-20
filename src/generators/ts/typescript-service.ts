import { join } from "path";
import { TypeScriptSource } from "./typescript-source";
import { FractureComponent } from "../../core";
import { formatStringByNamingStrategy } from "../../core/naming-strategy";
import { Service } from "../../core/service";

export class TypescriptService extends FractureComponent {
  public readonly service: Service;
  public readonly outdir: string;
  public readonly typeFile: TypeScriptSource;

  constructor(service: Service) {
    super(service.fracture);

    this.service = service;
    this.outdir = join(
      this.fracture.options.outdir,
      this.service.name + "-service",
      "ts"
    );

    this.project.logger.info("-".repeat(80));
    this.project.logger.info(`TS:INIT Service: "${this.service.name}"`);

    // typefile we'll decorate with more types in some other places
    this.typeFile = new TypeScriptSource(this, join(this.outdir, "types.ts"));

    // some error and response types
    this.typeFile.open(`export type Error = {`);
    this.typeFile.line(`code: number;`);
    this.typeFile.line(`source: string;`);
    this.typeFile.line(`message: string;`);
    this.typeFile.line(`detail: string;`);
    this.typeFile.close(`}`);
    this.typeFile.line("\n");

    this.typeFile.open(`export type ${this.responseTypeName}<T> = {`);
    this.typeFile.line(`data?: T;`);
    this.typeFile.line(`errors: Error[];`);
    this.typeFile.line(`status: number;`);
    this.typeFile.close(`}`);
    this.typeFile.line("\n");

    this.typeFile.open(`export type ${this.listResponseTypeName}<T> = {`);
    this.typeFile.line(`data?: T[];`);
    this.typeFile.line(`errors: Error[];`);
    this.typeFile.line(`status: number;`);
    this.typeFile.close(`}`);
    this.typeFile.line("\n");
  }

  public build() {}

  public get responseTypeName() {
    return formatStringByNamingStrategy(
      "response",
      this.fracture.options.namingStrategy.ts.typeName
    );
  }

  public get listResponseTypeName() {
    return formatStringByNamingStrategy(
      "list-response",
      this.fracture.options.namingStrategy.ts.typeName
    );
  }
}
