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
        return { types: this._types };
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
