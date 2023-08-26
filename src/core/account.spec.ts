import { Account } from "./account";
import { Fracture } from "./fracture";

//let fracture: Fracture;

beforeEach(() => {
  //fracture = new Fracture();
});

describe("success conditions", () => {
  test("Smoke test", () => {
    const fracture = new Fracture();
    const account = new Account(fracture, {
      name: "foo",
      accountNumber: "123",
    });
    expect(account).toBeTruthy();
  });
});

describe("failure conditions", () => {
  test("Duplicate name", () => {
    const fracture = new Fracture();
    expect(() => {
      new Account(fracture, {
        name: "foo",
        accountNumber: "123",
      });
      new Account(fracture, {
        name: "foo",
        accountNumber: "1234",
      });
    }).toThrow("Duplicate account name");
  });
  test("Duplicate account number", () => {
    const fracture = new Fracture();
    expect(() => {
      new Account(fracture, {
        name: "foo",
        accountNumber: "123",
      });
      new Account(fracture, {
        name: "bar",
        accountNumber: "123",
      });
    }).toThrow("Duplicate account number");
  });
});
