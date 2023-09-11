import { Structure } from "./structure";
import { testDataService } from "../util/test-util";

test("Smoke test", () => {
  const service = testDataService();
  const structure = new Structure(service, { name: "bar" });
  expect(structure).toBeTruthy();
});
