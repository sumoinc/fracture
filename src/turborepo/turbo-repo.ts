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
     * LINTING
     *
     * Make sure we lint across all workspaces, the default task runs when
     * "npx projen default" (aka: "pj") is run. Default is also the first
     * step in the full "npx projen build" command.
     *
     **************************************************************************/

    project.defaultTask?.spawn(
      project.addTask("turbo:eslint", {
        description: "Lint all repos",
        exec: "pnpm turbo eslint",
      })
    );

    /***************************************************************************
     *
     * TESTING
     *
     * This runs turbo:test after the default root test finishes running. This
     * is annoying but in most cases the root project won't have any tests anyway.
     *
     **************************************************************************/

    project.testTask.spawn(
      project.addTask("turbo:test", {
        description: "Lint all repos",
        exec: "pnpm turbo test",
      })
    );

    /***************************************************************************
     *
     * SYNTH TASK
     *
     * We want to synth all workspaces and packages during the build task's
     * postComkpile step.
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
