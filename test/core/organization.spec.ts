import { TEST_ORG_ONE, TestFracture } from "../util";

test("Smoke test", () => {
  const fracture = new TestFracture();
  const org = fracture.testOrg();

  expect(org).toBeTruthy();
  expect(org.options.id).toBe(TEST_ORG_ONE);
});
