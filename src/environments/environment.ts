import { paramCase } from "change-case";
import { Component } from "projen";
import { NodeProject } from "projen/lib/javascript";
import { ValueOf } from "type-fest";

export const EnvironmentType = {
  AWS: "AWS",
  NETLIFY: "NETLIFY",
  VERCEL: "VERCEL",
} as const;

/**
 * Options for authorizing requests to a AWS CodeArtifact npm repository.
 */
export const AuthProviderType = {
  /**
   * Use fixed credentials provided via Github secrets.
   */
  AWS_ACCESS_AND_SECRET_KEY_PAIR: "AWS_ACCESS_AND_SECRET_KEY_PAIR",

  /**
   * Use ephemeral credentials provided via Github's OIDC integration with an IAM role.
   * See:
   * https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_create_oidc.html
   * https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services
   */
  AWS_GITHUB_OIDC: "AWS_GITHUB_OIDC",

  /**
   * Use A Netlify Token and Site Id.
   */
  NETLIFY_TOKEN: "NETLIFY_TOKEN",
} as const;

export interface EnvironmentOptions {
  /**
   * Friendly name for environment
   */
  readonly name: string;

  /**
   * Type of authprovider to use in this environment.
   */
  readonly authProviderType?: ValueOf<typeof AuthProviderType>;
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
   * Type of authprovider to use in this environment.
   */
  readonly authProviderType?: ValueOf<typeof AuthProviderType>;

  /**
   * The directory to deploy. This is typically set by the site or service
   * type, for example Vitepress, AWS, or NuxtJs
   */
  public deployDir?: string;

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
}
