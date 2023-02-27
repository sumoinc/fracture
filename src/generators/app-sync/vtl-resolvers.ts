import { addCreateRequest } from "./lib/vtl/add-create-request";
import { addCreateResponse } from "./lib/vtl/add-create-response";
import { addDeleteRequest } from "./lib/vtl/add-delete-request";
import { addDeleteResponse } from "./lib/vtl/add-delete-response";
import { addReadRequest } from "./lib/vtl/add-read-request";
import { addReadResponse } from "./lib/vtl/add-read-response";
import { addUpdateRequest } from "./lib/vtl/add-update-request";
import { addUpdateResponse } from "./lib/vtl/add-update-response";
import { FractureComponent } from "../../core/component";
import { Service } from "../../core/service";

export class VtlResolvers extends FractureComponent {
  public readonly service: Service;

  constructor(service: Service) {
    super(service.fracture);

    this.service = service;
  }

  public preSynthesize() {
    this.service.shapes
      .filter((e) => e.persistant)
      .forEach((e) => {
        addCreateRequest(this.service, e);
        addCreateResponse(this.service, e);
        addReadRequest(this.service, e);
        addReadResponse(this.service, e);
        addUpdateRequest(this.service, e);
        addUpdateResponse(this.service, e);
        addDeleteRequest(this.service, e);
        addDeleteResponse(this.service, e);
      });
  }
}
