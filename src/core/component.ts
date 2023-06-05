import { Component } from "projen";
import { FracturePackage } from "./fracture-package";

export interface FractureComponentOptions {
  fracturePackage: FracturePackage;
}

export class FractureComponent extends Component {
  public readonly fracturePackage: FracturePackage;
  public readonly namespace: string;

  constructor(fracturePackage: FracturePackage) {
    super(fracturePackage.project);

    this.fracturePackage = fracturePackage;
    this.namespace = fracturePackage.namespace;
  }
}
