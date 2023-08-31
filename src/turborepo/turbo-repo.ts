import { Component, JsonFile, YamlFile } from "projen";
import { NodeProject } from "projen/lib/javascript";

export class TurboRepo extends Component {
  /**
   * Returns the `TurboRepo` component of a project or creates one if it
   * doesn't exist yet. Singleton?
   */
  public static of(project: NodeProject): TurboRepo {
    const isTurboRepo = (c: Component): c is TurboRepo =>
      c instanceof TurboRepo;
    return project.components.find(isTurboRepo) ?? new TurboRepo(project);
  }

  /**
   * PNMP workspace file
   */
  public readonly workspaceRoots: Array<string> = [];

  constructor(public readonly project: NodeProject) {
    super(project);

    // ignore and don't package the cache directory
    project.addGitIgnore(".turbo");
    project.addPackageIgnore(".turbo");

    // don't package turbo files
    project.addPackageIgnore("turbo.json");

    // don't package pnpm's workspace file
    project.addPackageIgnore("pnpm-workspace.yaml");

    // turbo should be a dependancy
    project.addDevDeps("turbo");

    /***************************************************************************
     *
     * DEFAULT TASK
     *
     * Make sure we lint across all workspaces, the default task runs when
     * "npx projen default" (aka: "pj") is run. Default is also the first
     * step in the full "npx projen build" command.
     *
     **************************************************************************/

    /*
    const eslint = project.tasks.tryFind("eslint");
    if (eslint) {
      project.defaultTask?.spawn(eslint);
    }*/

    /**
     * project.addTask("turbo:eslint", {
        description: "Lint all repos",
        exec: "pnpm turbo eslint",
      })
     */

    //project.defaultTask?.spawn("eslint");

    /***************************************************************************
     *
     * Pre Compile
     *
     * Make sure any subprojects
     *
     **************************************************************************/

    /*
    project.preCompileTask?.spawn(
      project.addTask("turbo:build", {
        description: "Lint all repos",
        exec: "pnpm turbo build",
      })
    );
    */

    /***************************************************************************
     *
     * SYNTH TASK - Post Compile
     *
     * We want to synth all workspaces and packages during the build task's
     * postCompile step.
     *
     **************************************************************************/

    project.addTask("synth", {
      description: "Synthesizes your cdk app into cdk.out",
      exec: "pnpm turbo synth",
    });

    project.postCompileTask?.spawn(
      project.addTask("synth:silent", {
        description: "Synthesizes your cdk app into cdk.out",
        exec: "pnpm turbo synth:silent",
      })
    );

    /***************************************************************************
     *
     * TESTING
     *
     * Runs test on subprojects once the root upgrade task finishes.
     *
     **************************************************************************/

    const testTask = project.tasks.tryFind("test");
    if (testTask) {
      testTask.spawn(
        project.addTask("turbo:test", {
          description: "Test all subprojects",
          exec: "pnpm turbo test",
        })
      );
    }

    /***************************************************************************
     *
     * UPGRADE
     *
     * Runs upgrade on subprojects once the root upgrade task finishes.
     *
     **************************************************************************/

    /*
    const upgradeTask = project.tasks.tryFind("upgrade");
    if (upgradeTask) {
      upgradeTask.spawn(
        project.addTask("turbo:upgrade", {
          description: "Upgrade All subprojects",
          exec: "pnpm turbo test",
        })
      );
    }
    */

    /***************************************************************************
     *
     * DECLARE ROOT BUILDFILE
     *
     **************************************************************************/
    new JsonFile(this.project, "turbo.json", {
      obj: {
        $schema: "https://turborepo.org/schema.json",
        pipeline: {
          eslint: {
            dependsOn: ["^eslint"],
            cache: false,
          },
          synth: {
            dependsOn: ["^synth"],
            outputs: ["cdk-out/**"],
            outputMode: "new-only",
          },
          ["synth:silent"]: {
            dependsOn: ["^synth:silent"],
            outputs: ["cdk-out/**"],
            outputMode: "new-only",
          },
          test: {
            dependsOn: ["^test"],
            outputs: ["coverage**", "test-reports/**", "**/__snapshots__/**"],
            outputMode: "new-only",
          },
          upgrade: {
            dependsOn: ["^upgrade"],
            cache: false,
          },
        },
      },
    });
  }

  addWorkspaceRoot(path: string) {
    this.workspaceRoots.push(path);
  }

  preSynthesize(): void {
    // workspace config file
    new YamlFile(this.project, "pnpm-workspace.yaml", {
      obj: {
        // dedupe and loop
        packages: [...new Set(this.workspaceRoots)].map((path) => {
          return `${path}/*`;
        }),
      },
    });
  }
}
