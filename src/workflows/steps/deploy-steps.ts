import { JobStep } from "projen/lib/github/workflows-model";
import { AwsEnvironment } from "../../environments";
import { DeployJob } from "../jobs/deploy-job";

export const renderDeploySteps = (deployJob: DeployJob): Array<JobStep> => {
  const steps: Array<JobStep> = [];

  // if deploying top AWS, configure credentials
  if (deployJob.environment.authProviderType === "AWS_GITHUB_OIDC") {
    const e = deployJob.environment as AwsEnvironment;
    steps.push({
      name: "Configure AWS Credentials",
      uses: "aws-actions/configure-aws-credentials@v2",
      with: {
        "role-to-assume": `arn:aws:iam::${e.accountNumber}:role/${e.gitHubDeploymentOIDCRoleName}`,
        "aws-region": e.region,
        "role-duration-seconds": e.gitHubDeploymentOIDCRoleDurationSeconds,
      },
    });
  }
  /*
  authProviderType: awsEnvironment.authProviderType,
      awsCredentialsOidc: {
        roleToAssume: ,
        roleDurationSeconds:
          awsEnvironment.gitHubDeploymentOIDCRoleDurationSeconds,
        awsRegion: awsEnvironment.region,
      },
  */

  deployJob.deploySteps.forEach((step) => {
    steps.push(step);
  });

  return steps;
};
