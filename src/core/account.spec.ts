import { LogLevel } from "projen";
import { Account } from "./account";
import { Fracture } from "./fracture";

/*******************************************************************************
 * TEST SETUP
 ******************************************************************************/

let account: Account;

beforeEach(() => {
  const fracture = new Fracture({
    name: "test-project",
    logging: {
      level: LogLevel.OFF,
    },
  });
  const org = fracture.addOrganization({ id: "test-org" });
  account = org.addAccount({ id: "id", name: "test-account" });
});

/*******************************************************************************
 * SMOKE TEST
 ******************************************************************************/

test("Smoke test", () => {
  expect(account).toBeTruthy();
});
