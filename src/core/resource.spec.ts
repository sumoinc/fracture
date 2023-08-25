import { Fracture } from "./fracture";
import { FractureService } from "./fracture-service";
import { Resource } from "./resource";

let service: FractureService;

beforeEach(() => {
  const fracture = new Fracture();
  service = new FractureService(fracture, { name: "test" });
});

test("Smoke test", () => {
  const resource = new Resource(service, { name: "foo" });
  expect(resource).toBeTruthy();
});

test("Able to add attribute", () => {
  const resource = new Resource(service, { name: "foo" });
  const attribute = resource.addAttribute({ name: "bar" });
  expect(attribute).toBeTruthy();
});
