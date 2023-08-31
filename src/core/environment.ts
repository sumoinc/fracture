import { paramCase } from "change-case";
import { Component } from "projen";
import { NodeProject } from "projen/lib/javascript";
import { ValueOf } from "type-fest";
import { REGION_IDENTITIER } from "./region";

export interface EnvironmentOptions {
  /**
   * Friendly name for environment
   */
  name: string;
  /**
   * Account number for this environment.
   */
  accountNumber: string;
  /**
   * Region for this envirnoment.
   *
   * @default us-east-1
   */
  region?: ValueOf<typeof REGION_IDENTITIER>;
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
  /**
   * Account for this environment.
   */
  public readonly accountNumber: string;
  /**
   * Region for this envirnoment.
   *
   * @default us-east-1
   */
  public readonly region: ValueOf<typeof REGION_IDENTITIER>;

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

    /***************************************************************************
     * Set Props
     **************************************************************************/

    this.name = name;
    this.accountNumber = options.accountNumber;
    this.region = options.region ?? "us-east-1";
  }
}
