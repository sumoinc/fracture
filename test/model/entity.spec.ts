import { Entity } from "../../src";
import { TestFracture } from "../util";

test("Smoke test", () => {
  const entity = new Entity(new TestFracture(), { name: "foo" });
  expect(entity).toBeTruthy();

  //const foo = synthSnapshot(entity.fracture.project);
  //console.log(foo);
});
