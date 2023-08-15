import { LogLevel } from "projen";
import { Fracture } from "./fracture";
import { Organization } from "./organization";

/*******************************************************************************
 * TEST SETUP
 ******************************************************************************/

let org: Organization;

beforeEach(() => {
  const fracture = new Fracture({
    name: "test-project",
    logging: {
      level: LogLevel.OFF,
    },
  });
  org = fracture.addOrganization({ id: "test-org" });
});

/*******************************************************************************
 * SMOKE TEST
 ******************************************************************************/

test("Smoke test", () => {
  expect(org).toBeTruthy();
});
