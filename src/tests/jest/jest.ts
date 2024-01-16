import { Component } from "projen";
import { Jest as ProjenJest, Transform } from "projen/lib/javascript";
import { TypeScriptProject } from "projen/lib/typescript";

/**
 * Jest options, configured the way fracture wants them to be configured.
 */
export class Jest extends Component {
  constructor(public readonly project: TypeScriptProject) {
    super(project);

    // add type and ts-jest support
    this.project.addDevDeps(`@types/jest`);
    this.project.addDevDeps(`ts-jest`);

    // don't package test files
    this.project.addPackageIgnore("*.spec.d.ts");
    this.project.addPackageIgnore("*.spec.js");

    // configure jest
    new ProjenJest(this.project, {
      // forced options
      configFilePath: "jest.config.json",
      jestConfig: {
        roots: [`<rootDir>/${this.project.srcdir}`],
        testMatch: ["**/*.spec.ts"],
        preset: "ts-jest",
        transform: {
          ["^.+\\.ts?$"]: new Transform("ts-jest"),
        },
        moduleFileExtensions: ["js", "ts"],
        // code coverage rules
        /*
        coverageThreshold: {
          branches: 10,
          functions: 10,
          lines: 10,
          statements: -100,
        },
        */
      },
    });
  }
}
