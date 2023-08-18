import { TypeFactory } from "./type";
import { Fracture, FractureService } from "../../../core";
import { Structure } from "../../../core/structure";
import { StructureAttributeType } from "../../../core/structure-attribute";

let fracture: Fracture;
let service: FractureService;

beforeEach(() => {
  fracture = new Fracture();
  service = new FractureService(fracture, { name: "foo" });
});

test("Smoke test", () => {
  const structure = new Structure(service, {
    name: "MyType",
    attributes: [
      {
        name: "id",
        type: StructureAttributeType.STRING,
      },
    ],
  });
  const type = TypeFactory.toType({ service, structure });
  const content = TypeFactory.print([type]);

  console.log(content);
});
