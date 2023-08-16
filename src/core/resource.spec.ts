import { Fracture } from "./fracture";
import { Resource } from "./resource";

let fracture: Fracture;

beforeEach(() => {
  fracture = new Fracture();
});

test("Smoke test", () => {
  const resource = new Resource(fracture, { name: "foo" });
  expect(resource).toBeTruthy();
});
