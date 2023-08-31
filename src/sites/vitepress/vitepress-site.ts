import { join } from "path";
import { SampleFile } from "projen";
import {
  TypeScriptProject,
  TypeScriptProjectOptions,
} from "projen/lib/typescript";
import { Site } from "../site";

export const filesToScaffold = [
  "api-examples.md",
  "index.md",
  "markdown-examples.md",
  ".vitepress/config.mts",
  ".vitepress/theme/index.ts",
  ".vitepress/theme/style.css",
  ".vitepress/theme/Layout.vue",
];

export class VitePressSite extends Site {
  constructor(parent: TypeScriptProject, options: TypeScriptProjectOptions) {
    super(parent, {
      outdir: options.name,
      ...options,
    });

    this.addDevDeps("vitepress");
    this.addGitIgnore(".vitepress/dist");
    this.addGitIgnore(".vitepress/cache");

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

    // make sure we compile docs as part of standard default build
    // parent.compileTask.spawn(this.buildTask);

    /*
    parent.buildWorkflow?.addPostBuildSteps({
      name: `Build ${this.name}`,
      run: `npx projen build`,
      workingDirectory: `./${mergedOptions.outdir}`,
    });*/

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
