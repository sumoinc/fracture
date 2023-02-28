import { buildCreateLambda } from "./build-create-lambda";
import { Shape } from "../../../model";

export const buildAllLambda = (e: Shape) => {
  buildCreateLambda(e);
};
