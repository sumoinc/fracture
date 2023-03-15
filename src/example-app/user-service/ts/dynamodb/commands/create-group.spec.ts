import { createGroup } from "./create-group";
import {
  CreateGroupInput,
} from "../../types";

test("Smoke test", async () => {
  const fixture : CreateGroupInput = {
    name: 'foo',
  };
  const result = await createGroup(fixture);
  expect(result).toBeTruthy();
})
// ~~ Generated by projen. To modify, edit .projenrc.js and run "npx projen".
