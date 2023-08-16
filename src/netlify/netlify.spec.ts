import { Fracture } from "../core/fracture";
import { NuxtJsApp } from "../nuxtjs";
import { synthFile } from "../util/test-util";

let fracture: Fracture;
//let app: NuxtJsApp;

beforeEach(() => {
  fracture = new Fracture();
  /*app = */ new NuxtJsApp(fracture, { name: "test", netlify: true });
});

test("Smoke test", () => {
  const content = synthFile(fracture, ".github/workflows/test-deploy-main.yml");
  expect(content).toMatchSnapshot();
  console.log(content);
});
