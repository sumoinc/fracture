import { DynamoTable } from "./dynamo-table";
import { Fracture, FractureService } from "../core";

let service: FractureService;

beforeEach(() => {
  const fracture = new Fracture();
  service = new FractureService(fracture, { name: "test" });
});

test("Smoke test", () => {
  const table = new DynamoTable(service, { name: "foo" });
  expect(table).toBeTruthy();
});
