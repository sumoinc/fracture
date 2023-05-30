import { Account } from "../../src/core/account";
import { Organization } from "../../src/core/organization";
import { TestFracture } from "../util";

test("Smoke test", () => {
  const org = new Organization(new TestFracture(), { id: "org-12345" });
  const account = new Account(org, { id: "acc-12345" });
  expect(account).toBeTruthy();
  expect(account.options.id).toBe("acc-12345");
});
