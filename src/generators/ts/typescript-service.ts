import { join } from "path";
import { TypeScriptSource } from "./typescript-source";
import { FractureComponent } from "../../core/component";
import { formatStringByNamingStrategy } from "../../core/naming-strategy";
import { Service } from "../../core/service";

export class TypescriptService extends FractureComponent {
  public readonly service: Service;
  public readonly typeFile: TypeScriptSource;

  constructor(service: Service) {
    super(service.fracturePackage);

    this.service = service;

    this.project.logger.info("-".repeat(80));
    this.project.logger.info(`TS:INIT Service: "${this.service.name}"`);

    // typefile we'll decorate with more types in some other places
    this.typeFile = new TypeScriptSource(
      this,
      join(this.typedir, this.service.name + ".ts")
    );

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
  }

  public build() {}

  public get responseTypeName() {
    return formatStringByNamingStrategy(
      "response",
      this.service.namingStrategy.ts.typeName
    );
  }

  public get listResponseTypeName() {
    return formatStringByNamingStrategy(
      "list-response",
      this.service.namingStrategy.ts.typeName
    );
  }

  /*****************************************************************************
   *  OUT DIR LOCATIOMS
   ****************************************************************************/

  public get outdir() {
    return join(
      this.fracturePackage.outdir,
      "services",
      this.service.name,
      "ts"
    );
  }

  public get typedir() {
    return join(this.fracturePackage.outdir, "types");
  }

  public get dynamoCommandDir() {
    return join(this.outdir, "dynamodb", "commands");
  }
}
