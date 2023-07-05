import { TEST_ACCOUNT_ONE, TestFracture } from "../util";

test("Smoke test", () => {
  const fracture = new TestFracture();
  const account = fracture.testAccount();

  expect(account).toBeTruthy();
  expect(account.options.id).toBe(TEST_ACCOUNT_ONE);
});
