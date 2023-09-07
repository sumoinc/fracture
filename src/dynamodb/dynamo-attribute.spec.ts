import { NodeProject } from "projen/lib/javascript";
import { DynamoAttribute } from "./dynamo-attribute";

test("Smoke test", () => {
  const project = new NodeProject({
    name: "my-project",
    defaultReleaseBranch: "main",
  });

  const attribute = new DynamoAttribute(project, { name: "foo" });
  expect(attribute).toBeTruthy();
});
