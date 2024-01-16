import crypto from "crypto";
import { JobStep } from "projen/lib/github/workflows-model";
import { DeployJob } from "../jobs";
import { PERMISSION_BACKUP_FILE } from "../workflow";

export const renderDownloadArtifactSteps = (
  deployJob: DeployJob
): Array<JobStep> => {
  const steps: Array<JobStep> = [];

  // hash the name of the artifact directory to avoid collisions
  let hash = crypto
    .createHash("md5")
    .update(deployJob.artifactsDirectory)
    .digest("hex")
    .substring(0, 8);

  // add artifact upload steps
  steps.push(
    {
      name: `Download build artifacts for "${deployJob.artifactsDirectory}"`,
      uses: "actions/download-artifact@v3",
      with: {
        name: `build-artifact-${hash}`,
        path: deployJob.artifactsDirectory,
      },
    },
    {
      name: `Restore build artifact permissions for "${deployJob.artifactsDirectory}"`,
      continueOnError: true,
      run: `setfacl --restore=${PERMISSION_BACKUP_FILE}`,
      workingDirectory: deployJob.artifactsDirectory,
    }
  );

  return steps;
};
