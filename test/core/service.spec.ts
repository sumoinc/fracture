import { Service } from "../../src/core/service";
import { TestFracture } from "../util";

test("Smoke test", () => {
  const entity = new Service(new TestFracture(), { name: "foo" });
  expect(entity).toBeTruthy();

  //const foo = synthSnapshot(entity.fracture.project);
  //console.log(foo);
});
