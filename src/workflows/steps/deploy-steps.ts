import { JobStep } from "projen/lib/github/workflows-model";
import { AuthProviderType, AwsEnvironment } from "../../environments";
import { NetlifyEnvironment } from "../../environments/netlify-environment";
import { DeployJob } from "../jobs/deploy-job";

export const renderDeploySteps = (deployJob: DeployJob): Array<JobStep> => {
  const steps: Array<JobStep> = [];

  // no authprovider!
  if (deployJob.environment.authProviderType === AuthProviderType.NONE) {
    throw new Error(
      `No auth provider specified for environment "${deployJob.environment.name}".`
    );
  }

  // AWS deployment types
  if (deployJob.environment instanceof AwsEnvironment) {
    if (
      deployJob.environment.authProviderType ===
      AuthProviderType.AWS_GITHUB_OIDC
    ) {
      steps.push({
        name: "Configure AWS Credentials",
        uses: "aws-actions/configure-aws-credentials@v2",
        with: {
          "role-to-assume": `arn:aws:iam::${deployJob.environment.account}:role/${deployJob.environment.gitHubDeploymentOIDCRoleName}`,
          "aws-region": deployJob.environment.region,
          "role-duration-seconds":
            deployJob.environment.gitHubDeploymentOIDCRoleDurationSeconds,
        },
      });
    }
  }

  // Netlify deployment types
  if (deployJob.environment instanceof NetlifyEnvironment) {
    steps.push({
      name: "Deploy to Netlify",
      uses: "netlify/actions/cli@master",
      with: {
        args: `deploy --dir=${deployJob.artifactsDirectory} --prod`,
      },
      env: {
        NETLIFY_AUTH_TOKEN:
          "${{ secrets." + deployJob.environment.authTokenSecretName + " }}",
        ...(deployJob.environment.siteId
          ? { NETLIFY_SITE_ID: deployJob.environment.siteId }
          : {
              NETLIFY_SITE_ID:
                "${{ secrets." + deployJob.environment.siteIdSecretName + " }}",
            }),
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
