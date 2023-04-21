import { buildCreateRequest } from "./build-create-request";
import { buildCreateResponse } from "./build-create-response";
import { buildDeleteRequest } from "./build-delete-request";
import { buildDeleteResponse } from "./build-delete-response";
import { buildReadRequest } from "./build-read-request";
import { buildReadResponse } from "./build-read-response";
import { buildUpdateRequest } from "./build-update-request";
import { buildUpdateResponse } from "./build-update-response";
import { Resource } from "../../../core/resource";
import { Service } from "../../../core/service";

export const buildAllVtl = (service: Service, e: Resource) => {
  buildCreateRequest(service, e);
  buildCreateResponse(service, e);
  buildReadRequest(service, e);
  buildReadResponse(service, e);
  buildUpdateRequest(service, e);
  buildUpdateResponse(service, e);
  buildDeleteRequest(service, e);
  buildDeleteResponse(service, e);
};
