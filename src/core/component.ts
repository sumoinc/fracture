import { Component } from "projen";
import { Fracture } from "./fracture";

export interface FractureComponentOptions {
  fracture: Fracture;
}

export class FractureComponent extends Component {
  public readonly fracture: Fracture;
  public readonly namespace: string;

  constructor(fracture: Fracture) {
    super(fracture.project);

    this.fracture = fracture;
    this.namespace = fracture.namespace;
  }
}
