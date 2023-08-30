import { Component } from "projen";
import { GenerateTypes } from "./ts";
import { GenerateCdkApp } from "./ts/cdk-app";
import { GenerateConfigurations } from "./ts/configurations";
import { Fracture, FractureService } from "../core";

export class GenerateKitchenSink extends Component {
  constructor(fracture: Fracture) {
    super(fracture);

    /***************************************************************************
     * Typescript Service Generators
     **************************************************************************/

    FractureService.all(fracture).forEach((service) => {
      new GenerateTypes(service);
      new GenerateCdkApp(service);
      new GenerateConfigurations(service);
    });
  }
}
