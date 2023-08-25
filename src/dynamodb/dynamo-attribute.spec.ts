import { DynamoAttribute } from "./dynamo-attribute";
import { Fracture } from "../core/fracture";
import { FractureService } from "../core/fracture-service";

let service: FractureService;

beforeEach(() => {
  const fracture = new Fracture();
  service = new FractureService(fracture, { name: "test" });
});

test("Smoke test", () => {
  const attribute = new DynamoAttribute(service, { name: "foo" });
  expect(attribute).toBeTruthy();
});
