import { BuildJob } from "./build-job";
import { Fracture } from "../core";

let fracture: Fracture;

beforeEach(() => {
  fracture = new Fracture();
});

test("Default - basic build job", () => {
  const buildJob = new BuildJob(fracture);

  expect(buildJob.job).toMatchSnapshot();
  // console.log(JSON.stringify(buildJob.job, null, 2));
});

test("Build with pre and post steps", () => {
  const buildJob = new BuildJob(fracture, {
    preBuildSteps: [
      {
        name: "Pre Step",
        run: "echo 'pre step'",
      },
    ],
    postBuildSteps: [
      {
        name: "Post Step",
        run: "echo 'pre step'",
      },
    ],
  });

  expect(buildJob.job).toMatchSnapshot();
  // console.log(JSON.stringify(buildJob.job, null, 2));
});
