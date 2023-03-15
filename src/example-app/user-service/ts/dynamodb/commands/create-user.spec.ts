import { createUser } from "./create-user";
import {
  CreateUserInput,
} from "../../types";

test("Smoke test", async () => {
  const fixture : CreateUserInput = {
    firstName: 'foo',
    lastName: 'foo',
  };
  const result = await createUser(fixture);
  expect(result).toBeTruthy();
})
// ~~ Generated by projen. To modify, edit .projenrc.js and run "npx projen".
