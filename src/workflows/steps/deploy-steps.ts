import { JobStep } from "projen/lib/github/workflows-model";
import { DeployJob } from "../jobs/deploy-job";

export const renderDeploySteps = (deployJob: DeployJob): Array<JobStep> => {
  const steps: Array<JobStep> = [];

  // if deploying top AWS, configure credentials
  if (deployJob.authProvider.awsCredentialsOidc) {
    steps.push({
      name: "Configure AWS Credentials",
      uses: "aws-actions/configure-aws-credentials@v2",
      with: {
        "role-to-assume":
          deployJob.authProvider.awsCredentialsOidc.roleToAssume,
        "aws-region": deployJob.authProvider.awsCredentialsOidc.awsRegion,
        "role-duration-seconds":
          deployJob.authProvider.awsCredentialsOidc.roleDurationSeconds,
      },
    });
  }

  deployJob.deploySteps.forEach((step) => {
    steps.push(step);
  });

  return steps;
};
