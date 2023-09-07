import { NodeProject } from "projen/lib/javascript";
import { DynamoAttribute } from "./dynamo-attribute";
import { DynamoGsi } from "./dynamo-gsi";

test("Smoke test", () => {
  const project = new NodeProject({
    name: "my-project",
    defaultReleaseBranch: "main",
  });
  const gsi = new DynamoGsi(project, {
    name: "foo",
    pk: new DynamoAttribute(project, { name: "pk" }),
    sk: new DynamoAttribute(project, { name: "sk" }),
  });
  expect(gsi).toBeTruthy();
});
