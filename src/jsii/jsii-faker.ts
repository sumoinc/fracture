import { Component, JsonFile } from "projen";
import { TypeScriptProject } from "projen/lib/typescript";

/**
 * !!! WARNING - VERY EXPEERIMENTAL !!!
 *
 * This is possibly a terrible idea, but for now it's the only way that I can
 * find to generate a minimal `.jsii` file so that Projen can then consume this
 * package when called similar to:
 *
 *  `npx projen new @sumoc/fracture common`
 *
 * What you are missing by not using the projen built in JsiiProject type:
 *
 * - No automatic API.md file.
 * - No compatable versions in other language like GO, Java, Python.
 * - Other things?
 *
 * What you gain by using this:
 *
 * - Freedom from some fairly significant limitations that JSII imposes on your
 *   Typescript (https://aws.github.io/jsii/user-guides/lib-author/typescript-restrictions/)
 * - Ability to publish / consume pure Typescript project types more easily.
 *
 */

interface JsiiType {
  name: string;
  assembly: string;
  kind: string;
  base?: string;
  fqn: string;
  parameters: Array<any>;
}

export class JsiiFaker extends Component {
  private _types: { [name: string]: JsiiType } = {};

  constructor(public readonly project: TypeScriptProject) {
    super(project);

    new JsonFile(project, ".jsii", {
      obj: () => {
        return {
          author: {
            name: "me",
            roles: ["author"],
            url: "https://github.com/sumoinc",
          },
          dependencies: {
            projen: "^0.79.2",
          },
          dependencyClosure: {
            constructs: {
              targets: {
                dotnet: {
                  namespace: "Constructs",
                  packageId: "Constructs",
                },
                go: {
                  moduleName: "github.com/aws/constructs-go",
                },
                java: {
                  maven: {
                    artifactId: "constructs",
                    groupId: "software.constructs",
                  },
                  package: "software.constructs",
                },
                js: {
                  npm: "constructs",
                },
                python: {
                  distName: "constructs",
                  module: "constructs",
                },
              },
            },
            projen: {
              submodules: {
                "projen.awscdk": {},
                "projen.build": {},
                "projen.cdk": {},
                "projen.cdk8s": {},
                "projen.cdktf": {},
                "projen.circleci": {},
                "projen.github": {},
                "projen.github.workflows": {},
                "projen.gitlab": {},
                "projen.java": {},
                "projen.javascript": {},
                "projen.python": {},
                "projen.release": {},
                "projen.typescript": {},
                "projen.vscode": {},
                "projen.web": {},
              },
              targets: {
                go: {
                  moduleName: "github.com/projen/projen-go",
                },
                java: {
                  maven: {
                    artifactId: "projen",
                    groupId: "io.github.cdklabs",
                  },
                  package: "io.github.cdklabs.projen",
                },
                js: {
                  npm: "projen",
                },
                python: {
                  distName: "projen",
                  module: "projen",
                },
              },
            },
          },
          description: "@sumoc/fracture",
          docs: {
            stability: "stable",
          },
          homepage: "https://github.com/sumoinc/fracture",
          jsiiVersion: "5.1.12 (build 0675712)",
          license: "Apache-2.0",
          metadata: {
            jsii: {
              pacmak: {
                hasDefaultInterfaces: true,
              },
            },
            tscRootDir: "src",
          },
          name: "@sumoc/fracture",
          readme: {
            markdown: "# replace this",
          },
          repository: {
            type: "git",
            url: "git@github.com:sumoinc/fracture.git",
          },
          schema: "jsii/0.10.0",
          targets: {
            js: {
              npm: "@sumoc/fracture",
            },
          },
          types: this._types,
        };
      },
    });
  }

  public addProjectType(options: { classPath: string; basePath: string }) {
    this._types[options.classPath] = {
      name: options.classPath.split(".")[1],
      assembly: options.classPath.split(".")[0],
      kind: "class",
      base: options.basePath,
      fqn: options.classPath,
      parameters: [
        {
          name: "options",
          type: {
            fqn: `${options.basePath}Options`,
          },
        },
      ],
    };
  }
}
