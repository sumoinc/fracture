import { Component } from "projen";
//import { ApiGateway } from "./api-gateway";
import { Types } from "./ts";
import { Service } from "../services/service";

export class KitchenSink extends Component {
  constructor(public readonly project: Service) {
    super(project);

    /***************************************************************************
     * Typescript Service Generators
     **************************************************************************/

    new Types(project);

    //new ApiGateway(project);
  }
}
