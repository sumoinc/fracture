import { Attribute, Entity } from "../../src";
import { TestFracture } from "../util";

test("Smoke test", () => {
  const entity = new Entity(new TestFracture(), { name: "foo" });
  const attribute = new Attribute(entity, { name: "foo" });
  expect(attribute).toBeTruthy();
});
