import { Account, Organization, OrganizationalUnit } from "../../src";
import { TestFracturePackage } from "../util";

test("Ignores duplicates", () => {
  const org = new Organization(new TestFracturePackage(), { id: "org-12345" });
  const ou = new OrganizationalUnit(org, { id: "ou-12345", name: "OU" });
  const account = new Account(org, {
    id: "acc-12345",
    organizationalUnit: ou,
  });
  account.addRegion({ id: "us-east-1" });
  account.addRegion({ id: "us-east-2" });
  account.addRegion({ id: "us-east-2" });

  expect(ou.regions.length).toBe(2);
});

test("Aggregates across accounts", () => {
  const org = new Organization(new TestFracturePackage(), { id: "org-12345" });
  const ou = new OrganizationalUnit(org, { id: "ou-12345", name: "OU" });
  const accountOne = new Account(org, {
    id: "acc-12345",
    organizationalUnit: ou,
  });
  const accountTwo = new Account(org, {
    id: "acc-12345",
    organizationalUnit: ou,
  });
  accountOne.addRegion({ id: "us-east-1" });
  accountOne.addRegion({ id: "us-east-2" });
  accountTwo.addRegion({ id: "us-east-2" });

  expect(ou.regions.length).toBe(2);
});
