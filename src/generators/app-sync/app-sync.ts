import { VtlResolvers } from "./vtl-resolvers";
import { FractureComponent } from "../../core/component";
import { Service } from "../../core/service";

export class AppSync extends FractureComponent {
  public readonly service: Service;

  constructor(service: Service) {
    super(service.fracture);

    this.service = service;

    // add VTL revsolvers to the app
    new VtlResolvers(service);
  }
}
