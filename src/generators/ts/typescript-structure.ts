import { Component } from "projen";

import { Service } from "../../core/fracture-service";
import { Resource } from "../../core/resource.ts-disabled";
import { Structure } from "../../core/structure.ts-disabled";

export class TypescriptStructure extends Component {
  // source
  public readonly structure: Structure;

  constructor(structure: Structure) {
    super(structure.project);

    //this.tsResource = tsResource;
    this.structure = structure;

    this.project.logger.info(`TS:INIT Structure: "${this.structure.name}"`);
  }

  /*
  public get publicInterfaceName() {
    return formatStringByNamingStrategy(
      this.structure.name,
      this.service.namingStrategy.ts.interfaceName
    );
  }
  */

  // writePublicInterface() {
  //   this.service.ts.typeFile.comments(this.structure.comments);
  //   this.service.ts.typeFile.open(
  //     `export interface ${this.publicInterfaceName} {`
  //   );
  //   this.structure.publicAttributes.forEach((a) => {
  //     this.service.ts.typeFile.comments(a.comments);
  //     this.service.ts.typeFile.line(
  //       `${a.ts.attributeName}${a.ts.required}: ${a.ts.type};`
  //     );
  //   });
  //   this.service.ts.typeFile.close(`}`);

  //   this.service.ts.typeFile.line("");
  // }

  public get service(): Service {
    return this.structure.service;
  }

  public get resource(): Resource {
    return this.structure.resource;
  }
}
