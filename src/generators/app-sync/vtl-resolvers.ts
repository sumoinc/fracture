import { addCreateRequest } from "./lib/vtl/add-create-request";
import { addCreateResponse } from "./lib/vtl/add-create-response";
import { addDeleteRequest } from "./lib/vtl/add-delete-request";
import { addDeleteResponse } from "./lib/vtl/add-delete-response";
import { addReadRequest } from "./lib/vtl/add-read-request";
import { addReadResponse } from "./lib/vtl/add-read-response";
import { addUpdateRequest } from "./lib/vtl/add-update-request";
import { addUpdateResponse } from "./lib/vtl/add-update-response";
import { FractureComponent } from "../../core/component";
import { Fracture } from "../../core/fracture";

export class VtlResolvers extends FractureComponent {
  constructor(fracture: Fracture) {
    super(fracture);
  }

  public preSynthesize() {
    this.fracture.entities.forEach((e) => {
      addCreateRequest(e);
      addCreateResponse(e);
      addReadRequest(e);
      addReadResponse(e);
      addUpdateRequest(e);
      addUpdateResponse(e);
      addDeleteRequest(e);
      addDeleteResponse(e);
    });
  }
}
