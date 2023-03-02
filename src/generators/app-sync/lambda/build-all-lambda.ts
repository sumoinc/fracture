import { buildCreateLambda } from "./build-create-lambda";
import { Resource } from "../../../core/resource";

export const buildAllLambda = (e: Resource) => {
  buildCreateLambda(e);
};
