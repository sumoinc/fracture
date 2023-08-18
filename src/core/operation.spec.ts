import { Fracture } from "./fracture";
import { FractureService } from "./fracture-service";
import { Operation } from "./operation";

let service: FractureService;

beforeEach(() => {
  const fracture = new Fracture();
  service = new FractureService(fracture, { name: "test" });
});

test("Smoke test", () => {
  const operation = new Operation(service, {
    name: "save-user",
    dynamoGsi: service.dynamoTable.keyGsi,
  });
  expect(operation).toBeTruthy();
});
