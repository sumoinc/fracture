import { Component } from "projen";
import { NodeProject } from "projen/lib/javascript";
import { ValueOf } from "type-fest";
import { REGION_IDENTITIER } from "../core";

/**
 * Options for authorizing requests to a AWS CodeArtifact npm repository.
 */
export const AuthProviderType = {
  /**
   * Fixed credentials provided via Github secrets.
   */
  ACCESS_AND_SECRET_KEY_PAIR: "ACCESS_AND_SECRET_KEY_PAIR",

  /**
   * Ephemeral credentials provided via Github's OIDC integration with an IAM role.
   * See:
   * https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_create_oidc.html
   * https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services
   */
  GITHUB_OIDC: "GITHUB_OIDC",
} as const;

export interface CredentialsOidc {
  /**
   * The ARN of the role for OIDC to assume at AWS.
   */
  readonly roleToAssume: string;

  /**
   *  The region of the role for OIDC to assume at AWS.
   **/
  readonly awsRegion: ValueOf<typeof REGION_IDENTITIER>;

  /**
   * The duration of the role session in seconds.
   */
  readonly roleDurationSeconds: number;
}

export interface CredentialsSecretKeyPair {
  /**
   * GitHub secret name which contains secret access key.
   *
   */
  readonly accessKeyIdSecret?: string;

  /**
   * GitHub secret name which contains secret access key.
   */
  readonly secretAccessKeySecret?: string;
}

export interface AuthProviderOptions {
  /**
   * Type of auth provider to use.
   */
  readonly authProviderType: ValueOf<typeof AuthProviderType>;

  /**
   * If GITHUB_OIDC, values for the OIDC credentials.
   */
  readonly credentialsOidc?: CredentialsOidc;

  /**
   * If ACCESS_AND_SECRET_KEY_PAIR, values for the key pais
   */
  readonly credentialsSecretKeyPair?: CredentialsSecretKeyPair;
}

export class AuthProvider extends Component {
  /**
   * Type of auth provider to use.
   */
  public readonly authProviderType: ValueOf<typeof AuthProviderType>;

  /**
   * If GITHUB_OIDC, values for the OIDC credentials.
   */
  public readonly credentialsOidc?: CredentialsOidc;

  /**
   * If ACCESS_AND_SECRET_KEY_PAIR, values for the key pais
   */
  public readonly credentialsSecretKeyPair?: CredentialsSecretKeyPair;

  constructor(
    public readonly project: NodeProject,
    options: AuthProviderOptions
  ) {
    super(project);

    // props
    this.authProviderType = options.authProviderType;
    this.credentialsOidc = options.credentialsOidc;
    this.credentialsSecretKeyPair = options.credentialsSecretKeyPair;

    if (
      this.authProviderType === AuthProviderType.GITHUB_OIDC &&
      !this.credentialsOidc
    ) {
      throw new Error(
        "credentialsOidc must be provided when authProviderType is GITHUB_OIDC"
      );
    }

    if (
      this.authProviderType === AuthProviderType.ACCESS_AND_SECRET_KEY_PAIR &&
      !this.credentialsSecretKeyPair
    ) {
      throw new Error(
        "credentialsSecretKeyPair must be provided when authProviderType is ACCESS_AND_SECRET_KEY_PAIR"
      );
    }
  }
}
