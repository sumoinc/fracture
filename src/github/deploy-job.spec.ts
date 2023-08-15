import { DeployJob } from "./deploy-job";
import { Fracture } from "../core";

let fracture: Fracture;

beforeEach(() => {
  fracture = new Fracture();
});

test("Default - basic deploy job", () => {
  const buildJob = new DeployJob(fracture);

  expect(buildJob.job).toMatchSnapshot();
  // console.log(JSON.stringify(buildJob.job, null, 2));
});
