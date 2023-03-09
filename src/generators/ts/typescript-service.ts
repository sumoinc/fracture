import { join } from "path";
import { TypescriptResource } from "./typescript-resource";
import { TypeScriptSource } from "./typescript-source";
import { TypescriptStructure } from "./typescript-structure";
import { FractureComponent } from "../../core";
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

    this.typeFile = new TypeScriptSource(this, join(this.outdir, "types.ts"));

    /**
     * Public types
     */
    this.service.resources.forEach((resource) => {
      const tsDataStructure = new TypescriptStructure(resource.dataStructure);
      tsDataStructure.writePublicInterface(this.typeFile);
    });

    // some error and response types
    this.typeFile.open(`export type Error = {`);
    this.typeFile.line(`code: number;`);
    this.typeFile.line(`source: string;`);
    this.typeFile.line(`message: string;`);
    this.typeFile.line(`detail: string;`);
    this.typeFile.close(`}`);
    this.typeFile.line("\n");

    this.typeFile.open(`export type Response<T> = {`);
    this.typeFile.line(`data: T | T[];`);
    this.typeFile.line(`errors: Error[];`);
    this.typeFile.line(`status: number;`);
    this.typeFile.close(`}`);
    this.typeFile.line("\n");

    /**
     * Build operations
     */
    this.service.resources.forEach((resource) => {
      new TypescriptResource(this, resource);
    });
  }
}
