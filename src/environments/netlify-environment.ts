import { NodeProject } from "projen/lib/javascript";
import { Environment, EnvironmentOptions } from "./environment";

export interface NetlifyEnvironmentOptions extends EnvironmentOptions {
  /**
   * Github Secret name for the NETLIFY_AUTH_TOKEN
   *
   * @default NETLIFY_AUTH_TOKEN
   */
  readonly authTokenSecretName?: string;

  /**
   * Github Secret name for the NETLIFY_SITE_ID. Ignored if siteId is provided.
   *
   * @default NETLIFY_SITE_ID
   */
  readonly siteIdSecretName?: string;

  /**
   * Site Id for netlify site.
   */
  readonly siteId?: string;

  /**
   * The directory to deploy to Netlify.
   *
   * @default dist
   */
  readonly deployDir?: string;
}

export class NetlifyEnvironment extends Environment {
  /**
   * Github Secret name for the NETLIFY_AUTH_TOKEN
   *
   * @default NETLIFY_AUTH_TOKEN
   */
  public readonly authTokenSecretName: string;

  /**
   * Github Secret name for the NETLIFY_SITE_ID. Ignored if siteId is provided.
   *
   * @default NETLIFY_SITE_ID
   */
  public readonly siteIdSecretName: string;

  /**
   * Site Id for netlify site.
   */
  public readonly siteId?: string;

  /**
   * The directory to deploy to Netlify.
   *
   * @default dist
   */
  public deployDir: string;

  constructor(
    public readonly project: NodeProject,
    options: NetlifyEnvironmentOptions
  ) {
    super(project, options);

    // defaults
    this.authTokenSecretName =
      options.authTokenSecretName ?? "NETLIFY_AUTH_TOKEN";
    this.siteIdSecretName = options.siteIdSecretName ?? "NETLIFY_SITE_ID";
    this.siteId = options.siteId;
    this.deployDir = options.deployDir ?? "dist";
  }

  /*
  public get authProvider(): AuthProvider {
    return AuthProvider.fromNetlifyEnvironment(this.project, this);
  }
  */
}
