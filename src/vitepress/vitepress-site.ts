import { join } from "path";
import { SampleFile } from "projen";
import {
  NodePackageManager,
  NodeProject,
  NodeProjectOptions,
} from "projen/lib/javascript";
import { SetOptional } from "type-fest";
import { DeploymentWorkflow } from "../workflows/deployment-workflow";

export const filesToScaffold = [
  "api-examples.md",
  "index.md",
  "markdown-examples.md",
  ".vitepress/config.mts",
  ".vitepress/theme/index.ts",
  ".vitepress/theme/style.css",
  ".vitepress/theme/Layout.vue",
];

export class VitePressSite extends NodeProject {
  constructor(
    parent: NodeProject,
    options: SetOptional<
      NodeProjectOptions,
      "name" | "defaultReleaseBranch"
    > = {}
  ) {
    const mergedOptions = {
      name: "docs",
      outdir: "docs",
      defaultReleaseBranch: "main",
      license: options.license ?? "MIT",
      prettier: options.prettier ?? true,
      packageManager: options.packageManager ?? NodePackageManager.PNPM,
      pnpmVersion: options.pnpmVersion ?? "8",
      workflowNodeVersion: options.workflowNodeVersion ?? "18",
      parent,
      ...options,
    };

    super({
      ...mergedOptions,
    });

    this.addDevDeps("vitepress");
    this.addGitIgnore(".vitepress/dist");
    this.addGitIgnore(".vitepress/cache");
    parent.npmignore?.exclude(mergedOptions.outdir);

    /**
     * !!! BIG CHEAT !!!
     *
     * These files are adapted from scaffold(), found here:
     * https://github.com/vuejs/vitepress/blob/main/src/node/init/init.ts
     *
     * Templates are all found here:
     * https://github.com/vuejs/vitepress/tree/main/template
     *
     **/
    filesToScaffold.map((file) => {
      new SampleFile(this, file, {
        sourcePath: join(__dirname, "template", file),
      });
    });

    /***
     * Add some shortcut commends that vitepress devs will expect to exist.
     */
    // add commands to run vitepress
    this.addTask("docs:dev", {
      exec: "pnpm vitepress dev",
    });
    this.addTask("docs:build", {
      exec: "pnpm vitepress build",
    });
    this.addTask("docs:preview", {
      exec: "pnpm vitepress preview",
    });

    // make sure we build docs as part of standard default build
    parent.buildWorkflow?.addPostBuildSteps({
      name: `Build ${this.name}`,
      run: `npx projen build`,
      workingDirectory: `./${mergedOptions.outdir}`,
    });

    const workflow =
      DeploymentWorkflow.of(parent) ?? new DeploymentWorkflow(parent, {});

    if (workflow) {
      console.log("workflow exists");
    }

    /**
     * Make sure we have a deployment workflow on the default branch to deploy
     * this site.
     */

    // const deployWorkflow =
    //   Pipeline.byBranchName(parent, mergedOptions.defaultReleaseBranch) ??
    //   new Pipeline(parent, { branchName: mergedOptions.defaultReleaseBranch });
    // deployWorkflow.paths.push(mergedOptions.outdir);

    // const vpArtifactName = `vp-${this.name}-artifact`;

    // // add vitepress output as an artifact
    // deployWorkflow.workflow.addPostBuildSteps({
    //   name: `Upload ${this.name} artifact`,
    //   uses: "actions/upload-artifact@v3",
    //   with: {
    //     name: vpArtifactName,
    //     path: join(mergedOptions.outdir, ".vitepress/dist"),
    //   },
    // });

    // deployWorkflow.workflow.addPostBuildJob(`deploy-${this.name}`, {
    //   runsOn: ["ubuntu-latest"],
    //   permissions: {
    //     contents: JobPermission.READ,
    //     idToken: JobPermission.WRITE,
    //   },
    //   steps: [
    //     {
    //       name: "Download build artifacts",
    //       uses: "actions/download-artifact@v3",
    //       with: {
    //         name: vpArtifactName,
    //         path: join(mergedOptions.outdir, ".vitepress/dist"),
    //       },
    //     },
    //     /*
    //       {
    //         name: "Configure AWS Credentials",
    //         uses: "aws-actions/configure-aws-credentials@v2",
    //         with: {
    //           "role-to-assume": `arn:aws:iam::${sdt.environment.accountNumber}:role/GitHubDeploymentOIDCRole`,
    //           "aws-region": sdt.environment.region,
    //         },
    //       },
    //       */
    //     {
    //       name: "Deploy",
    //       //run: `npx aws-cdk@${sdt.service.cdkDeps.cdkVersion} deploy --no-rollback --app ${sdt.service.cdkOutDistDir} ${sdt.stackPattern}`,
    //     },
    //   ],
    // });

    /*
    parent.release?.addJobs({
      bar: {
        needs: ["foo"],
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
            },
          },
          {
            name: "Deploy",
            //run: `npx aws-cdk@${sdt.service.cdkDeps.cdkVersion} deploy --no-rollback --app ${sdt.service.cdkOutDistDir} ${sdt.stackPattern}`,
          },
        ],
      },
    });
    */
  }
}
