import { Account } from "./account";
import { Environment } from "./environment";
import { Fracture } from "./fracture";

let fracture: Fracture;
let account: Account;

beforeEach(() => {
  fracture = new Fracture();
  account = new Account(fracture, { name: "foo", accountNumber: "123" });
});

test("Smoke test", () => {
  const environment = new Environment(fracture, {
    name: "foo",
    account: account,
    region: "us-east-1",
  });
  expect(environment).toBeTruthy();
});
