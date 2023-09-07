import { Component, JsonFile, YamlFile } from "projen";
import { NodeProject } from "projen/lib/javascript";
import { ValueOf } from "type-fest";

export const TurboOutputModeType = {
  FULL: "full",
  HASH_ONLY: "hash-only",
  NEW_ONLY: "new-only",
  ERRORS_ONLY: "errors-only",
  NONE: "none",
} as const;

export type TurboTask = {
  cache?: boolean;
  dependsOn?: Array<string>;
  dotEnv?: Array<string>;
  env?: Array<string>;
  inputs?: Array<string>;
  outputs?: Array<string>;
  outputMode?: ValueOf<typeof TurboOutputModeType>;
  passThroughEnv?: Array<string>;
  persistent?: boolean;
};

/**
 * The build and test task that should be run for each subproject.
 */
export type TurboTaskSet = {
  /**
   * Name found in sub-project's package file.
   */
  name: string;
  buildTask: Record<string, TurboTask>;
  testTask: Record<string, TurboTask>;
};

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
   * PNMP workspace file roots
   */
  public readonly workspaceRoots: Array<string> = [];

  /**
   * Task definitions for each subproject
   */
  public readonly taskSets: Array<TurboTaskSet> = [];

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

    const eslint = project.tasks.tryFind("eslint");
    if (eslint) {
      project.defaultTask?.spawn(eslint);
      project.defaultTask?.spawn(
        project.addTask("turbo:eslint", {
          description: "Lint all repos",
          exec: "pnpm turbo eslint",
        })
      );
    }

    /***************************************************************************
     *
     * BUILD & TEST SUB PROJECTS
     *
     * This is a little bit of build pipeline inception. Projen has it's own
     * task dependancy graph for it's pipelines, but we want to tie into the
     * added speed Turborepo gives us in a monorapo.
     *
     * The task created here runs after "npx projen build" finishes. but before
     * self mutation checks.
     *
     **************************************************************************/

    project.postCompileTask?.spawn(
      project.addTask("turbo:build", {
        description: "Builds all subprojects",
        exec: "pnpm turbo turbo:build",
      })
    );
  }

  addWorkspaceRoot(path: string) {
    this.workspaceRoots.push(path);
  }

  preSynthesize(): void {
    // build tasks for sub projects
    const tasks = this.taskSets.reduce((acc, taskSet) => {
      // script names
      const buildScript = Object.keys(taskSet.buildTask).join();
      const testScript = Object.keys(taskSet.testTask).join();

      // set build defaults
      acc[`${taskSet.name}#${buildScript}`] = {
        outputMode: "new-only",
        cache: true,
        ...taskSet.buildTask[buildScript],
      };

      // set test defaults, add build as dependancy
      acc[`${taskSet.name}#${testScript}`] = {
        outputMode: "new-only",
        cache: true,
        ...taskSet.testTask,
        dependsOn: [
          `${taskSet.name}#${buildScript}`,
          ...(taskSet.testTask[testScript].dependsOn ?? []),
        ],
      };

      return acc;
    }, {} as Record<string, TurboTask>);

    // turbo config file, run everything for now, might limit what runs later
    new JsonFile(this.project, "turbo.json", {
      obj: {
        $schema: "https://turborepo.org/schema.json",
        pipeline: {
          eslint: {
            dependsOn: ["^eslint"],
            cache: false,
          },
          ["turbo:build"]: {
            dependsOn: Object.keys(tasks),
            outputMode: "new-only",
          },
          ...tasks,

          // ["site:build"]: {
          //   dependsOn: ["^site:build"],
          //   outputs: [".vitepress/dist/**"],
          //   outputMode: "new-only",
          // },
          // synth: {
          //   dependsOn: ["^synth"],
          //   outputs: ["cdk-out/**"],
          //   outputMode: "new-only",
          // },
          // ["synth:silent"]: {
          //   dependsOn: ["^synth:silent"],
          //   outputs: ["cdk-out/**"],
          //   outputMode: "new-only",
          // },
          // test: {
          //   dependsOn: ["^test"],
          //   outputs: ["coverage**", "test-reports/**", "**/__snapshots__/**"],
          //   outputMode: "new-only",
          // },
        },
      },
    });

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
