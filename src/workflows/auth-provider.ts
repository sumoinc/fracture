import { Component } from "projen";
import { NodeProject } from "projen/lib/javascript";
import { ValueOf } from "type-fest";
import { AwsRegion, AwsEnvironment } from "../environments/aws-environment";

/**
 * Options for authorizing requests to a AWS CodeArtifact npm repository.
 */
export const AuthProviderType = {
  /**
   * Fixed credentials provided via Github secrets.
   */
  AWS_ACCESS_AND_SECRET_KEY_PAIR: "AWS_ACCESS_AND_SECRET_KEY_PAIR",

  /**
   * Ephemeral credentials provided via Github's OIDC integration with an IAM role.
   * See:
   * https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_create_oidc.html
   * https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services
   */
  AWS_GITHUB_OIDC: "AWS_GITHUB_OIDC",
} as const;

export interface AwsCredentialsOidc {
  /**
   * The ARN of the role for OIDC to assume at AWS.
   */
  readonly roleToAssume: string;

  /**
   *  The region of the role for OIDC to assume at AWS.
   **/
  readonly awsRegion: ValueOf<typeof AwsRegion>;

  /**
   * The duration of the role session in seconds.
   */
  readonly roleDurationSeconds: number;
}

export interface AwsCredentialsSecretKeyPair {
  /**
   * GitHub secret name which contains secret access key.
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
   * If AWS_GITHUB_OIDC, values for the OIDC credentials.
   */
  readonly awsCredentialsOidc?: AwsCredentialsOidc;

  /**
   * If AWS_ACCESS_AND_SECRET_KEY_PAIR, values for the key pais
   */
  readonly awsCredentialsSecretKeyPair?: AwsCredentialsSecretKeyPair;
}

export class AuthProvider extends Component {
  /**
   * Returns AuthCredentials for a supplied envidonment
   */
  public static fromAwsEnvironment(
    project: NodeProject,
    awsEnvironment: AwsEnvironment
  ): AuthProvider {
    return new AuthProvider(project, {
      authProviderType: awsEnvironment.authProviderType,
      awsCredentialsOidc: {
        roleToAssume: `arn:aws:iam::${awsEnvironment.accountNumber}:role/${awsEnvironment.gitHubDeploymentOIDCRoleName}`,
        roleDurationSeconds:
          awsEnvironment.gitHubDeploymentOIDCRoleDurationSeconds,
        awsRegion: awsEnvironment.region,
      },
    });
  }

  /**
   * Type of auth provider to use.
   */
  public readonly authProviderType: ValueOf<typeof AuthProviderType>;

  /**
   * If AWS_GITHUB_OIDC, values for the OIDC credentials.
   */
  public readonly awsCredentialsOidc?: AwsCredentialsOidc;

  /**
   * If AWS_ACCESS_AND_SECRET_KEY_PAIR, values for the key pais
   */
  public readonly awsCredentialsSecretKeyPair?: AwsCredentialsSecretKeyPair;

  constructor(
    public readonly project: NodeProject,
    options: AuthProviderOptions
  ) {
    super(project);

    // props
    this.authProviderType = options.authProviderType;
    this.awsCredentialsOidc = options.awsCredentialsOidc;
    this.awsCredentialsSecretKeyPair = options.awsCredentialsSecretKeyPair;

    if (
      this.authProviderType === AuthProviderType.AWS_GITHUB_OIDC &&
      !this.awsCredentialsOidc
    ) {
      throw new Error(
        "awsCredentialsOidc must be provided when authProviderType is GITHUB_OIDC"
      );
    }

    if (
      this.authProviderType === AuthProviderType.AWS_ACCESS_AND_SECRET_KEY_PAIR
    ) {
      throw new Error(
        "authProviderType of AWS_ACCESS_AND_SECRET_KEY_PAIR not yet suported"
      );
    }
  }
}
