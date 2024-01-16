import { Types } from "./types";
import { complexService, synthFile } from "../../util/test-util";

test("Resource formatting test", () => {
  const service = complexService();
  new Types(service);
  const content = synthFile(service, "src/types.ts");
  expect(content).toBeTruthy();
  expect(content).toMatchSnapshot();
  //console.log(content);
});
