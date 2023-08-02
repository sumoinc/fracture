import { TEST_ORG_ONE, TEST_REGION_ONE, TestFracture } from "./test-util";

/*******************************************************************************
 * TEST SETUP
 ******************************************************************************/

let fracture: TestFracture;

beforeEach(() => {
  fracture = new TestFracture();
});

/*******************************************************************************
 * SMOKE TEST
 ******************************************************************************/

test("Smoke test", () => {
  expect(fracture).toBeTruthy();
});

/*******************************************************************************
 * OPTIONS
 ******************************************************************************/

describe("Default Options", () => {
  test("Default name matches", () => {
    expect(fracture.name).toBe("test-project");
  });

  test("Default release branch matches", () => {
    expect(fracture.release?.branches).toEqual(["main"]);
  });
});

/*******************************************************************************
 * ORGANIZATIONS
 ******************************************************************************/

describe("Organizations", () => {
  test("Creates default org", () => {
    expect(fracture.testOrg().id).toBe(TEST_ORG_ONE);
    expect(fracture.organizations.length).toBe(1);
  });

  test("Supports ad-hoc Orgs", () => {
    fracture.addOrganization({ id: "ad-hoc-org" });
    expect(fracture.testOrg().id).toBe("ad-hoc-org");
    expect(fracture.organizations.length).toBe(1);
  });
});
