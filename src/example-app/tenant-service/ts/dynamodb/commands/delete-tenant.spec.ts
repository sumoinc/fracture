import { setup, startDb, stopDb, createTables, deleteTables } from "jest-dynalite";
import { resolve } from "path";
import "jest-dynalite/withDb";
import { deleteTenant } from "./delete-tenant";
import {
  DeleteTenantInput,
} from "../../types";

/**
 * Sometimes dynalite tests can require a little additional
 * time when you are running a lot of them in parallel.
 */
jest.setTimeout(10000);

setup(resolve("./"));
beforeAll(startDb);
beforeEach(createTables);
afterEach(deleteTables);
afterAll(stopDb);

test("Smoke test", async () => {
  const fixture : DeleteTenantInput = {
    id: 'foo',
  };
  const result = await deleteTenant(fixture);
  expect(result).toBeTruthy();
})
// ~~ Generated by projen. To modify, edit .projenrc.js and run "npx projen".
