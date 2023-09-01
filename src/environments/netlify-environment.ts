import { NodeProject } from "projen/lib/javascript";
import { ValueOf } from "type-fest";
import { Environment, EnvironmentOptions } from "./environment";
import { Settings } from "../core/fracture-settings";
import { AuthProvider, AuthProviderType } from "../workflows/auth-provider";

export interface NetlifyEnvironmentOptions extends EnvironmentOptions {
  /**
   * Github Secret name for the NETLIFY_AUTH_TOKEN
   *
   * @default NETLIFY_AUTH_TOKEN
   */
  readonly authTokenSecretName?: string;

  /**
   * Github Secret name for the NETLIFY_SITE_ID
   *
   * @default NETLIFY_SITE_ID
   */
  readonly siteIdSecretName?: string;
}

export class NetlifyEnvironment extends Environment {
  /**
   * Github Secret name for the NETLIFY_AUTH_TOKEN
   *
   * @default NETLIFY_AUTH_TOKEN
   */
  readonly authTokenSecretName: string;

  /**
   * Github Secret name for the NETLIFY_SITE_ID
   *
   * @default NETLIFY_SITE_ID
   */
  readonly siteIdSecretName: string;

  constructor(
    public readonly project: NodeProject,
    options: NetlifyEnvironmentOptions
  ) {
    super(project, options);

    // defaults
    this.authTokenSecretName =
      options.authTokenSecretName ?? "NETLIFY_AUTH_TOKEN";
    this.siteIdSecretName = options.siteIdSecretName ?? "NETLIFY_SITE_ID";
  }

  /*
  public get authProvider(): AuthProvider {
    return AuthProvider.fromNetlifyEnvironment(this.project, this);
  }
  */
}
