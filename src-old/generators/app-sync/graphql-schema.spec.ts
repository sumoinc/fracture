import { GraphqlSchema } from "./graphql-schema";
import { complexService, synthFile } from "../../util";

describe("Success Conditions", () => {
  test("Smoke test", () => {
    const service = complexService();

    new GraphqlSchema(service);

    const content = synthFile(service, "src/schema.graphql");
    expect(content).toBeTruthy();
    expect(content).toMatchSnapshot();
    //console.log(content);
  });
});
