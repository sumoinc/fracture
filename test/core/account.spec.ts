import { Account } from "../../src/core/account";
import { Organization } from "../../src/core/organization";
import { TestFracturePackage } from "../util";

test("Smoke test", () => {
  const org = new Organization(new TestFracturePackage(), { id: "org-12345" });
  const account = new Account(org, { id: "acc-12345" });
  expect(account).toBeTruthy();
  expect(account.options.id).toBe("acc-12345");
});
