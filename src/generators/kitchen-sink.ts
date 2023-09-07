import { Component } from "projen";
import { HttpApi, RestApi } from "./api-gateway/";
import { GraphqlApi } from "./app-sync";
import { Types } from "./ts";
import { Service } from "../services/service";

export class KitchenSink extends Component {
  constructor(public readonly project: Service) {
    super(project);

    // Base Typescript Types
    new Types(project);

    // Various API types
    new RestApi(project);
    new HttpApi(project);
    new GraphqlApi(project);
  }
}
