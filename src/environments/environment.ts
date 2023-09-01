import { paramCase } from "change-case";
import { Component } from "projen";
import { NodeProject } from "projen/lib/javascript";
import { AuthProvider } from "../workflows/auth-provider";

export const EnvironmentType = {
  AWS: "AWS",
  NETLIFY: "NETLIFY",
  VERCEL: "VERCEL",
} as const;

export interface EnvironmentOptions {
  /**
   * Friendly name for environment
   */
  readonly name: string;
}

export class Environment extends Component {
  /**
   * Returns a environment by name, or undefined if it doesn't exist
   */
  public static byName(
    project: NodeProject,
    name: string
  ): Environment | undefined {
    const isDefined = (c: Component): c is Environment =>
      c instanceof Environment && c.name === name;
    return project.components.find(isDefined);
  }

  /**
   * Friendly name for environment
   */
  public readonly name: string;

  constructor(
    public readonly project: NodeProject,
    options: EnvironmentOptions
  ) {
    /***************************************************************************
     * Check Duplicates
     **************************************************************************/

    const name = paramCase(options.name);

    if (Environment.byName(project, name)) {
      throw new Error(`Duplicate environment name "${name}".`);
    }

    super(project);

    this.name = options.name;
  }

  public get authProvider(): AuthProvider {
    throw new Error("Not implemented, override in subclass.");
  }
}
