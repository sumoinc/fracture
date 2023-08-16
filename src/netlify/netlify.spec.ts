import { Netlify } from "./netlify";
import { Fracture } from "../core/fracture";
import { synthFile } from "../util/test-util";

let fracture: Fracture;

beforeEach(() => {
  fracture = new Fracture();
});

test("No args", () => {
  new Netlify(fracture);
  const content = synthFile(
    fracture,
    ".github/workflows/netlify-deploy-main.yml"
  );
  expect(content).toMatchSnapshot();
  //console.log(content);
});

test("With  args", () => {
  new Netlify(fracture, {
    nameBase: "foo",
    productionBranchName: "bar",
    netlifySsiteId: "baz",
  });
  const content = synthFile(fracture, ".github/workflows/foo-deploy-bar.yml");
  expect(content).toMatchSnapshot();
  //console.log(content);
});
