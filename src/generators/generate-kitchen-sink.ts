import { Component } from "projen";
import { GeneratedTypes } from "./ts";
import { GeneratedCdkApp } from "./ts/cdk-app";
import { GeneratedConfigurations } from "./ts/configurations";
import { Fracture, FractureService } from "../core";

export class GenerateKitchenSink extends Component {
  constructor(fracture: Fracture) {
    super(fracture);

    /***************************************************************************
     * Typescript Service Generators
     **************************************************************************/

    FractureService.all(fracture).forEach((service) => {
      new GeneratedTypes(service);
      new GeneratedCdkApp(service);
      new GeneratedConfigurations(service);
    });
  }
}
