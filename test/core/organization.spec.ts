import { Organization } from "../../src/core/organization";
import { TestFracture } from "../util";

test("Smoke test", () => {
  const org = new Organization(new TestFracture(), { id: "org-12345" });
  expect(org).toBeTruthy();
  expect(org.options.id).toBe("org-12345");
});
