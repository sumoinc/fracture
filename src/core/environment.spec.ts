import { LogLevel } from "projen";
import { Environment } from "./environment";
import { Fracture } from "./fracture";
import { REGION_IDENTITIER } from "./region";

/*******************************************************************************
 * TEST SETUP
 ******************************************************************************/

let environment: Environment;

beforeEach(() => {
  const fracture = new Fracture({
    name: "test-project",
    logging: {
      level: LogLevel.OFF,
    },
  });
  const org = fracture.addOrganization({ id: "test-org" });
  const account = org.addAccount({ id: "id", name: "test-account" });
  environment = fracture.addEnvironment({
    account,
    region: REGION_IDENTITIER.US_EAST_1,
  });
});

/*******************************************************************************
 * SMOKE TEST
 ******************************************************************************/

test("Smoke test", () => {
  expect(environment).toBeTruthy();
});
