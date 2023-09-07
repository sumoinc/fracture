import { TypeScriptProject } from "projen/lib/typescript";
import { Types } from "./types";
import { DataService } from "../../services/data-service";
import { synthFile } from "../../util/test-util";

test("Resource formatting test", () => {
  const parent = new TypeScriptProject({
    name: "my-project",
    defaultReleaseBranch: "main",
  });
  const service = new DataService({
    parent,
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
  new Types(service);

  const content = synthFile(service, "src/types.ts");
  expect(content).toBeTruthy();
  expect(content).toMatchSnapshot();
  // console.log(content);
});
