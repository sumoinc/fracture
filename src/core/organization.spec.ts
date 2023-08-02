import { Fracture } from "./fracture";
import { Organization } from "./organization";

/*******************************************************************************
 * TEST SETUP
 ******************************************************************************/

let org: Organization;

beforeEach(() => {
  const fracture = new Fracture({
    name: "test-project",
    defaultReleaseBranch: "main",
  });
  org = fracture.addOrganization({ id: "test-org" });
});

/*******************************************************************************
 * SMOKE TEST
 ******************************************************************************/

test("Smoke test", () => {
  expect(org).toBeTruthy();
});
