import { StructureAttribute } from "./structure-attribute";
import { testDataService } from "../util/test-util";

test("Smoke test", () => {
  const service = testDataService();
  const att = new StructureAttribute(service, { name: "bar" });
  expect(att).toBeTruthy();
});
