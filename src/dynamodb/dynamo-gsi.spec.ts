import { DynamoAttribute } from "./dynamo-attribute";
import { DynamoGsi } from "./dynamo-gsi";
import { Fracture, FractureService } from "../core";

let service: FractureService;

beforeEach(() => {
  const fracture = new Fracture();
  service = new FractureService(fracture, { name: "test" });
});

test("Smoke test", () => {
  const pk = new DynamoAttribute(service, { name: "pk" });
  const sk = new DynamoAttribute(service, { name: "sk" });
  const gsi = new DynamoGsi(service, { name: "foo", pk, sk });
  expect(gsi).toBeTruthy();
});
