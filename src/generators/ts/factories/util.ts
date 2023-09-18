import { ValueOf } from "type-fest";
import { ResourceAttributeType } from "../../../services";

export const JsType = {
  STRING: "string",
  NUMBER: "number",
  BOOLEAN: "boolean",
  ARRAY: "array",
  MAP: "map",
  OTHER: "other",
} as const;

export const jsType = (
  resourceAttributeType: ValueOf<typeof ResourceAttributeType> | string
) => {
  switch (resourceAttributeType) {
    case ResourceAttributeType.GUID:
    case ResourceAttributeType.STRING:
    case ResourceAttributeType.EMAIL:
    case ResourceAttributeType.PHONE:
    case ResourceAttributeType.URL:
    case ResourceAttributeType.DATE:
    case ResourceAttributeType.TIME:
    case ResourceAttributeType.DATE_TIME:
    case ResourceAttributeType.JSON:
    case ResourceAttributeType.IPADDRESS:
      return JsType.STRING;
    case ResourceAttributeType.INT:
    case ResourceAttributeType.FLOAT:
    case ResourceAttributeType.TIMESTAMP:
    case ResourceAttributeType.COUNT:
    case ResourceAttributeType.AVERAGE:
    case ResourceAttributeType.SUM:
      return JsType.NUMBER;
    case ResourceAttributeType.BOOLEAN:
      return JsType.BOOLEAN;
    case ResourceAttributeType.ARRAY:
      return JsType.ARRAY;
    case ResourceAttributeType.MAP:
      return JsType.MAP;
    default:
      return JsType.OTHER;
  }
};
