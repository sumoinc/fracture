import { buildAllVtl } from "./vtl/build-all-vtl";
import { FractureComponent } from "../../core/component";
import { Service } from "../../core/service";

export class AppSync extends FractureComponent {
  public readonly service: Service;

  constructor(service: Service) {
    super(service.fracture);

    this.service = service;
  }

  public preSynthesize() {
    this.service.resources
      .filter((e) => e.persistant)
      .forEach((e) => {
        buildAllVtl(this.service, e);
        //buildAllLambda(e);
      });
  }
}
