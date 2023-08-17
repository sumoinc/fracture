import { Fracture, FractureService } from "../../core";
import { synthFile } from "../../util/test-util";

let fracture: Fracture;

beforeEach(() => {
  fracture = new Fracture();
});

test("Smoke test", () => {
  new FractureService(fracture, { name: "foo" });
  const content = synthFile(fracture, "services/foo/generated/ts/types.ts");
  expect(content).toMatchSnapshot();
  // console.log(content);
});
