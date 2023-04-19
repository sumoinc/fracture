import { createTables, deleteTables, startDb, stopDb, } from "jest-dynalite";
import { createUser } from "./create-user";
import {
  CreateUserInput,
} from "../../../../../types/user";

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
  const fixture : CreateUserInput = {
    firstName: "foo",
    lastName: "foo",
  };
  const { data, errors, status } = await createUser(fixture);
  expect(data).toBeTruthy();
  expect(errors.length).toBe(0);
  expect(status).toBe(200);
})

// ~~ Generated by projen. To modify, edit .projenrc.js and run "npx projen".
