import { Account } from "./account";
import { Fracture } from "./fracture";

let fracture: Fracture;

beforeEach(() => {
  fracture = new Fracture();
});

test("Smoke test", () => {
  const account = new Account(fracture, { name: "foo", accountNumber: "123" });
  expect(account).toBeTruthy();
});
