import { Fracture } from "./fracture";
import { FractureService } from "./fracture-service";
import { ResourceAttribute } from "./resource-attribute";

let service: FractureService;

beforeEach(() => {
  const fracture = new Fracture();
  service = new FractureService(fracture, { name: "test" });
});

test("Smoke test", () => {
  const resource = new ResourceAttribute(service, { name: "foo" });
  expect(resource).toBeTruthy();
});
