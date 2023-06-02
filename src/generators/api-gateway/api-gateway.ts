import { FractureComponent } from "../../core/component";
import { Service } from "../../core/service";

export class ApiGateway extends FractureComponent {
  constructor(service: Service) {
    super(service.fracturePackage);
  }
}
