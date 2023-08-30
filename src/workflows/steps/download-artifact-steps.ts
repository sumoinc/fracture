import crypto from "crypto";
import { JobStep } from "projen/lib/github/workflows-model";
import { WorkflowJob } from "../jobs/workflow-job";
import { PERMISSION_BACKUP_FILE } from "../workflow";

export const renderDownloadArtifactSteps = (
  job: WorkflowJob
): Array<JobStep> => {
  const steps: Array<JobStep> = [];

  // dedupe and loop
  [...new Set(job.artifactDirectories)].forEach((artifactDirectory) => {
    // hash the name of the artifact directory to avoid collisions
    let hash = crypto
      .createHash("md5")
      .update(artifactDirectory)
      .digest("hex")
      .substring(0, 8);

    // add artifact upload steps
    steps.push(
      {
        name: `Download build artifacts for "${artifactDirectory}"`,
        uses: "actions/download-artifact@v3",
        with: {
          name: `build-artifact-${hash}`,
          path: artifactDirectory,
        },
      },
      {
        name: `Restore build artifact permissions for "${artifactDirectory}"`,
        continueOnError: true,
        run: `setfacl --restore=${PERMISSION_BACKUP_FILE}`,
        workingDirectory: artifactDirectory,
      }
    );
  });

  return steps;
};
