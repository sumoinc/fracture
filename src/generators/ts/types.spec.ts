import { GeneratedTypes } from "./types";
import { Fracture, FractureService } from "../../core";
import { synthFile } from "../../util/test-util";

test("Smoke test", () => {
  const fracture = new Fracture();
  new GeneratedTypes(new FractureService(fracture, { name: "my-service" }));
  const content = synthFile(
    fracture,
    "services/my-service/src/generated/types.ts"
  );
  expect(content).toBeTruthy();
  expect(content).toMatchSnapshot();
  // console.log(content);
});

test("Resource formatting test", () => {
  const fracture = new Fracture();
  const service = new FractureService(fracture, {
    name: "foo",
    resourceOptions: [
      {
        name: "User",
        attributeOptions: [
          {
            name: "first-name",
            shortName: "fn",
          },
          {
            name: "last-name",
            shortName: "ln",
          },
        ],
      },
    ],
  });
  new GeneratedTypes(service);

  const content = synthFile(fracture, "services/foo/src/generated/types.ts");
  expect(content).toBeTruthy();
  expect(content).toMatchSnapshot();
  // console.log(content);
});
