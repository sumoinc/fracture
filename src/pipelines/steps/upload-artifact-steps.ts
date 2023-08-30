import crypto from "crypto";
import { JobStep } from "projen/lib/github/workflows-model";
import { WorkflowJob } from "../jobs/workflow-job";
import { PERMISSION_BACKUP_FILE } from "../workflow";

export const renderUploadArtifactSteps = (job: WorkflowJob): Array<JobStep> => {
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
        name: `Backup artifact permissions for "${artifactDirectory}"`,
        continueOnError: true,
        run: `getfacl -R . > ${PERMISSION_BACKUP_FILE}`,
        workingDirectory: artifactDirectory,
      },
      {
        name: `Upload artifacts for "${artifactDirectory}"`,
        uses: "actions/upload-artifact@v3",
        with: {
          name: `build-artifact-${hash}`,
          path: artifactDirectory,
        },
      }
    );
  });

  return steps;
};
