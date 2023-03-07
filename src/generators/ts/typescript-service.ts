import { join } from "path";
import { TypescriptResource } from "./typescript-resource";
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
      this.fracture.outdir,
      this.service.name + "-service",
      "ts"
    );

    this.typeFile = new TypeScriptSource(this, join(this.outdir, "types.ts"));

    // some base types
    this.typeFile.open(`export type Error = {`);
    this.typeFile.line(`code: number;`);
    this.typeFile.line(`source: string;`);
    this.typeFile.line(`message: string;`);
    this.typeFile.line(`detail: string;`);
    this.typeFile.close(`}`);
    this.typeFile.line("\n");

    this.typeFile.open(`export type Response = {`);
    this.typeFile.line(`data: any;`);
    this.typeFile.line(`errors: Error[];`);
    this.typeFile.line(`status: number;`);
    this.typeFile.close(`}`);
    this.typeFile.line("\n");

    // build each resource
    this.service.resources.forEach((resource) => {
      new TypescriptResource(this, resource);
    });

    // build any resource type
    this.typeFile.open(`export type ${this.anyResourceName} =`);
    this.service.resources.forEach((resource) =>
      this.typeFile.line(`| ${resource.interfaceName}`)
    );
    this.typeFile.line("\n");
  }

  /**
   * Gets formatted interface name for this resource
   */
  public get anyResourceName() {
    return formatStringByNamingStrategy(
      "any-resource",
      this.fracture.namingStrategy.ts.typeName
    );
  }
}
