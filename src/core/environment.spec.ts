import { Account } from "./account";
import { Environment } from "./environment";
import { Fracture } from "./fracture";

describe("success conditions", () => {
  test("using account", () => {
    const fracture = new Fracture();
    const account = new Account(fracture, {
      name: "foo",
      accountNumber: "123",
    });
    const environment = new Environment(fracture, {
      name: "foo",
      account,
      region: "us-east-1",
    });
    expect(environment).toBeTruthy();
  });
  test("uses default accountNumber and region", () => {
    const fracture = new Fracture();
    const environment = new Environment(fracture, {
      name: "foo",
    });
    expect(environment.accountNumber).toBe(fracture.defaultAccountNumber);
    expect(environment.region).toBe(fracture.defaultRegion);
  });
  test("using undefined account", () => {
    const fracture = new Fracture();
    const environment = new Environment(fracture, {
      name: "foo",
      accountNumber: "123",
      region: "us-east-1",
    });
    expect(environment).toBeTruthy();
  });
  test("using existing account number", () => {
    const fracture = new Fracture();
    new Account(fracture, {
      name: "foo",
      accountNumber: "123",
    });
    const environment = new Environment(fracture, {
      name: "foo",
      accountNumber: "123",
      region: "us-east-1",
    });
    expect(environment).toBeTruthy();
  });
});

describe("failure conditions", () => {
  test("Duplicate name", () => {
    const fracture = new Fracture();
    expect(() => {
      new Environment(fracture, {
        name: "foo",
        accountNumber: "123",
        region: "us-east-1",
      });
      new Environment(fracture, {
        name: "foo",
        accountNumber: "123",
        region: "us-east-1",
      });
    }).toThrow("Duplicate environment name");
  });
});
