import { Component } from "projen";
import { ValueOf } from "type-fest";
import { AwsEnvironment, IAwsEnvironment } from "./aws-environment";
import { AwsOrganization } from "./aws-organization";
import { AwsRegionIdentifier } from "./aws-region";
import { CdkProject } from "../cdk";
import { DeployTarget } from "../cdk/config/deploy-target";
import {
  GithubOidcRole,
  GithubOidcRoleOptions,
  IGithubOidcRole,
} from "../github/github-oidc-role";

export interface IAwsAccount {
  readonly orgId: string;
  readonly account: string;
  readonly environments: Array<IAwsEnvironment>;
  //readonly deployTargets: Array<IDeployTarget>;
  readonly githubOidcRoles: Array<IGithubOidcRole>;
}

export interface AwsAccountOptions {
  readonly orgId?: string;
  readonly account: string;
  readonly regions?: Array<ValueOf<typeof AwsRegionIdentifier>>;
  /**
   * Define the of releases allowed into this account.
   */
  readonly githubOidcRoleOptions?: Array<
    Omit<GithubOidcRoleOptions, "account">
  >;
}

export class AwsAccount extends Component implements IAwsAccount {
  public static all(project: CdkProject): Array<AwsAccount> {
    const isDefined = (c: Component): c is AwsAccount =>
      c instanceof AwsAccount;
    return project.components.filter(isDefined);
  }

  /**
   * Create account if needed or return it if not.
   */
  public static ensureExists(
    project: CdkProject,
    options: AwsAccountOptions
  ): AwsAccount {
    /**
     * Find function
     */
    const isDefined = (c: Component): c is AwsAccount =>
      c instanceof AwsAccount && c.account === options.account;

    /**
     * It should exist in the project supplied.
     * Return this instance
     */
    return (
      project.components.find(isDefined) ?? new AwsAccount(project, options)
    );
  }

  public readonly orgId: string;
  public readonly account: string;

  constructor(public readonly project: CdkProject, options: AwsAccountOptions) {
    super(project);

    /***************************************************************************
     *
     * DEFAULTS
     *
     **************************************************************************/

    this.orgId =
      options.orgId ??
      AwsOrganization.byAccount(project, options.account).orgId;
    this.account = options.account;

    options.regions?.forEach((region) => {
      AwsEnvironment.ensureExists(this.project, {
        orgId: this.orgId,
        account: this.account,
        region,
      });
    });
  }

  public get environments() {
    return AwsEnvironment.all(this.project).filter(
      (env) => env.account === this.account
    );
  }

  public get deployTargets() {
    return DeployTarget.all(this.project).filter(
      (env) => env.account === this.account
    );
  }

  public get githubOidcRoles() {
    return GithubOidcRole.all(this.project).filter(
      (env) => env.account === this.account
    );
  }

  public config(): IAwsAccount {
    return {
      account: this.account,
      orgId: this.orgId,
      environments: this.environments.map((e) => e.config()),
      //deployTargets: this.deployTargets.map((t) => t.config()),
      githubOidcRoles: this.githubOidcRoles.map((r) => r.config()),
    };
  }
}
