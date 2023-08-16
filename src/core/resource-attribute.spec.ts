import { Fracture } from "./fracture";
import { ResourceAttribute } from "./resource-attribute";

let fracture: Fracture;

beforeEach(() => {
  fracture = new Fracture();
});

test("Smoke test", () => {
  const resource = new ResourceAttribute(fracture, { name: "foo" });
  expect(resource).toBeTruthy();
});
