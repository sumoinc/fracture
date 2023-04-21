import { Account } from "../../src/core/account";
import { Organization } from "../../src/core/organization";
import { TestFracture } from "../util";

test("Smoke test", () => {
  const org = new Organization(new TestFracture(), { orgId: "org-12345" });
  const account = new Account(org, { accountNo: "acc-12345" });
  expect(account).toBeTruthy();
  expect(account.options.accountNo).toBe("acc-12345");
});
