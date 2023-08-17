import { DynamoGsi } from "./dynamo-gsi";
import { Fracture, FractureService } from "../core";
import { ResourceAttribute } from "../core/resource-attribute";

let service: FractureService;

beforeEach(() => {
  const fracture = new Fracture();
  service = new FractureService(fracture, { name: "test" });
});

test("Smoke test", () => {
  const pk = new ResourceAttribute(service, { name: "pk" });
  const sk = new ResourceAttribute(service, { name: "sk" });
  const gsi = new DynamoGsi(service, { name: "foo", pk, sk });
  expect(gsi).toBeTruthy();
});
