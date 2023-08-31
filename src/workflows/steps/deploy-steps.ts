import { JobStep } from "projen/lib/github/workflows-model";
import { DeployJob } from "../jobs/deploy-job";

export const renderDeploySteps = (deployJob: DeployJob): Array<JobStep> => {
  const steps: Array<JobStep> = [];

  // if deploying top AWS, configure credentials
  if (deployJob.authProvider.credentialsOidc) {
    steps.push({
      name: "Configure AWS Credentials",
      uses: "aws-actions/configure-aws-credentials@v2",
      with: {
        "role-to-assume": deployJob.authProvider.credentialsOidc.roleToAssume,
        "aws-region": deployJob.authProvider.credentialsOidc.awsRegion,
        "role-duration-seconds":
          deployJob.authProvider.credentialsOidc.roleDurationSeconds,
      },
    });
  }

  steps.push({
    name: deployJob.deployTask.name,
    run: deployJob.workflow.github.project.runTaskCommand(deployJob.deployTask),
  });

  return steps;
};

/*
ServiceDeployTarget.byPipeline(this).forEach((sdt) => {
  this.workflow.addPostBuildJob(sdt.deployJobName, {
    needs: sdt.needs,
    runsOn: ["ubuntu-latest"],
    permissions: {
      contents: JobPermission.READ,
      idToken: JobPermission.WRITE,
    },
    steps: [
      {
        name: "Configure AWS Credentials",
        uses: "aws-actions/configure-aws-credentials@v2",
        with: {
          "role-to-assume": `arn:aws:iam::${sdt.environment.accountNumber}:role/GitHubDeploymentOIDCRole`,
          "aws-region": sdt.environment.region,
          "role-duration-seconds": 900,
        },
      },
      {
        name: "Deploy",
        run: `npx aws-cdk@${sdt.service.cdkDeps.cdkVersion} deploy --no-rollback --app ${sdt.service.cdkOutDistDir} ${sdt.stackPattern}`,
      },
    ],
  });
});
*/
