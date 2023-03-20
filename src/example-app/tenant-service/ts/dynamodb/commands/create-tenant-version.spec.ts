import { createTables, deleteTables, startDb, stopDb, } from "jest-dynalite";
import { createTenant } from "./create-tenant";
import { createTenantVersion } from "./create-tenant-version";
import {
  CreateTenantVersionInput,
} from "../../types";

/**
 * Sometimes dynalite tests can require a little additional
 * time when you are running a lot of them in parallel.
 *
 * https://www.npmjs.com/package/jest-dynalite
 */
jest.setTimeout(10000);

/**
 * Starts and stops dynalite for each test
 *
 * https://www.npmjs.com/package/jest-dynalite
 */
beforeAll(startDb);
beforeEach(createTables);
afterEach(deleteTables);
afterAll(stopDb);

test("Smoke test", async () => {
})

// ~~ Generated by projen. To modify, edit .projenrc.js and run "npx projen".
