import { Account } from "../../src/core/account";
import { Organization } from "../../src/core/organization";
import { TestFracture } from "../util";

test("Smoke test", () => {
  const org = new Organization(new TestFracture(), { orgId: "org-12345" });
  const account = new Account(org, { account: "acc-12345" });
  expect(account).toBeTruthy();
  expect(account.account).toBe("acc-12345");
});
