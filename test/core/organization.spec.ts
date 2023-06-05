import { Organization } from "../../src/core/organization";
import { TestFracturePackage } from "../util";

test("Smoke test", () => {
  const org = new Organization(new TestFracturePackage(), { id: "org-12345" });
  expect(org).toBeTruthy();
  expect(org.options.id).toBe("org-12345");
});
