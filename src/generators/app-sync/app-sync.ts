import { Component } from "projen";
import { Service } from "../../services/service";

export class AppSync extends Component {
  constructor(public readonly project: Service) {
    super(project);
  }

  /*
  public preSynthesize() {
    this.service.resources
      .filter((e) => e.persistant)
      .forEach((e) => {
        buildAllVtl(this.service, e);
        //buildAllLambda(e);
      });
  }
  */
}
