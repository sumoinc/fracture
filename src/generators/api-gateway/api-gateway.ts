import { Component } from "projen";
import { Service } from "../../core/service";

export class ApiGateway extends Component {
  constructor(service: Service) {
    super(service.fracture);
  }
}
