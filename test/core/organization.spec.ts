import { Organization } from "../../src/core/organization";
import { TestFracture } from "../util";

test("Smoke test", () => {
  const org = new Organization(new TestFracture(), { orgId: "org-12345" });
  expect(org).toBeTruthy();
  expect(org.options.orgId).toBe("org-12345");
});
