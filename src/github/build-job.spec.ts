import { LogLevel } from "projen";
import { BuildJob } from "./build-job";
import { Fracture } from "../core";

/*******************************************************************************
 * DEFAULT WORKFLOWS
 ******************************************************************************/

test("Default - basic build job", () => {
  const fracture = new Fracture({
    name: "test-project",
    logging: {
      level: LogLevel.OFF,
    },
  });
  const buildJob = new BuildJob(fracture, {});

  expect(buildJob.job).toMatchSnapshot();
  // console.log(JSON.stringify(buildJob.job, null, 2));
});

test("Build with pre and post steps", () => {
  const fracture = new Fracture({
    name: "test-project",
    logging: {
      level: LogLevel.OFF,
    },
  });
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
