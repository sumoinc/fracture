import { Component } from "projen";
import { TypeScriptProject } from "projen/lib/typescript";
import { ValueOf } from "type-fest";
import { AwsRegionIdentifier } from "../../../aws-organization";

export const BootstrapFlag = {
  /**
   * Earlier versions of the bootstrap template created an AWS KMS key in each
   * bootstrapped environment by default. To avoid charges for the KMS key,
   * re-bootstrap these environments using --no-bootstrap-customer-key. The
   * current default is no KMS key, which helps avoid these charges.
   */
  NO_BOOTSTRAP_CUSTOMER_KEY: "--no-bootstrap-customer-key",

  /**
   * overrides the name of the Amazon S3 bucket. May require changes to your
   * CDK app (see Stack synthesizers).
   */
  BOOTSTRAP_BUCKET_NAME: "--bootstrap-bucket-name",

  /**
   * overrides the AWS KMS key used to encrypt the S3 bucket.
   */
  BOOTSTRAP_KMS_KEY_ID: "--bootstrap-kms-key-id",

  /**
   * specifies the ARNs of managed policies that should be attached to the
   * deployment role assumed by AWS CloudFormation during deployment of your
   * stacks. By default, stacks are deployed with full administrator
   * permissions using the AdministratorAccess policy.
   *
   * The policy ARNs must be passed as a single string argument, with the
   * individual ARNs separated by commas. For example:
   *
   * --cloudformation-execution-policies "arn:aws:iam::aws:policy/AWSLambda_FullAccess,arn:aws:iam::aws:policy/AWSCodeDeployFullAccess".
   *
   * To avoid deployment failures, be sure the policies that you specify are
   * sufficient for any deployments you will perform in the environment
   * being bootstrapped.
   */
  CLOUDFORMATION_EXECUTION_POLICIES: "--cloudformation-execution-policies",

  /**
   * a string that is added to the names of all resources in the bootstrap
   * stack. A qualifier lets you avoid resource name clashes when you provision
   * multiple bootstrap stacks in the same environment. The default is
   * hnb659fds (this value has no significance).
   *
   * Changing the qualifier also requires that your CDK app pass the changed
   * value to the stack synthesizer. For more information, see Stack
   * synthesizers.
   */
  QUALIFIER: "--qualifier",

  /**
   * Use the indicated AWS profile when bootstrapping
   *
   * [string]
   */
  PROFILE: "--profile",

  /**
   * adds one or more AWS CloudFormation tags to the bootstrap stack.
   */
  TAGS: "--tags",

  /**
   * lists the AWS accounts that may deploy into the environment being
   * bootstrapped.
   *
   * Use this flag when bootstrapping an environment that a CDK Pipeline in
   * another environment will deploy into. The account doing the bootstrapping
   * is always trusted.
   */
  TRUST: "--trust",

  /**
   * lists the AWS accounts that may look up context information from the
   * environment being bootstrapped.
   *
   * Use this flag to give accounts permission to synthesize stacks that will
   * be deployed into the environment, without actually giving them permission
   * to deploy those stacks directly.
   */
  TRUST_FOR_LOOKUP: "--trust-for-lookup",

  /**
   * Prevents the bootstrap stack from being deleted. For more information, see
   * Protecting a stack from being deleted in the AWS CloudFormation User Guide.
   */
  TERMINATION_PROTECTION: "--termination-protection",
} as const;

export const AwsEnvironmentBootstrapQualifier = {
  DEFAULT: "hnb659fds",
} as const;

export interface BootstrapFlags {
  [BootstrapFlag.NO_BOOTSTRAP_CUSTOMER_KEY]?: boolean;
  [BootstrapFlag.BOOTSTRAP_BUCKET_NAME]?: string;
  [BootstrapFlag.BOOTSTRAP_KMS_KEY_ID]?: string;
  [BootstrapFlag.CLOUDFORMATION_EXECUTION_POLICIES]?: string;
  [BootstrapFlag.QUALIFIER]:
    | ValueOf<typeof AwsEnvironmentBootstrapQualifier>
    | string;
  [BootstrapFlag.PROFILE]: string;
  [BootstrapFlag.TAGS]?: string;
  [BootstrapFlag.TRUST]?: string;
  [BootstrapFlag.TRUST_FOR_LOOKUP]?: string;
  [BootstrapFlag.TERMINATION_PROTECTION]?: boolean;
}

export type BootstrapConfigOptions = {
  readonly account: string;
  readonly region: ValueOf<typeof AwsRegionIdentifier>;

  /**
   * Earlier versions of the bootstrap template created an AWS KMS key in each
   * bootstrapped environment by default. To avoid charges for the KMS key,
   * re-bootstrap these environments using --no-bootstrap-customer-key. The
   * current default is no KMS key, which helps avoid these charges.
   *
   * Set to "true" to avoid charges for the KMS key.
   *
   * @default true
   */
  readonly noBootstrapCustomerKey?: boolean;

  /**
   * The qualifier for this CDK bootstraping instance. Uses the CDK default if
   * not supplied as arg.
   *
   * @default AwsEnvironmentBootstrapQualifier.DEFAULT
   */
  readonly qualifier?:
    | ValueOf<typeof AwsEnvironmentBootstrapQualifier>
    | string;

  /**
   * Local profile name to use when depploying the bootstrap config.
   */
  readonly profileName: string;

  /**
   * What version to use when bootstrapping?
   *
   * @default latest
   */
  readonly cdkVersion?: string;
};

export class BootstrapConfig extends Component {
  public readonly account: string;
  public readonly region: ValueOf<typeof AwsRegionIdentifier>;
  public readonly noBootstrapCustomerKey: boolean;
  public readonly qualifier:
    | ValueOf<typeof AwsEnvironmentBootstrapQualifier>
    | string;
  public readonly profileName: string;
  public readonly flags: BootstrapFlags;
  public readonly cdkVersion: string;

  constructor(
    public readonly project: TypeScriptProject,
    options: BootstrapConfigOptions
  ) {
    super(project);

    /***************************************************************************
     * DEFAULT OPTIONS
     **************************************************************************/

    this.account = options.account;
    this.region = options.region;
    this.noBootstrapCustomerKey = options.noBootstrapCustomerKey ?? true;
    this.qualifier =
      options.qualifier ?? AwsEnvironmentBootstrapQualifier.DEFAULT;
    this.profileName = options.profileName;
    this.cdkVersion = options.cdkVersion ?? "latest";

    this.flags = {
      [BootstrapFlag.NO_BOOTSTRAP_CUSTOMER_KEY]: this.noBootstrapCustomerKey,
      [BootstrapFlag.PROFILE]: this.profileName,
      [BootstrapFlag.QUALIFIER]: this.qualifier,
    };
  }

  public get bootstrapCommand() {
    const cdkCommand =
      this.cdkVersion === "latest" ? "cdk" : `cdk@${this.cdkVersion}`;
    return [
      "npx",
      cdkCommand,
      "bootstrap",
      `aws://${this.account}/${this.region}`,

      // add flags
      ...Object.entries(this.flags).map(([key, value]) => {
        return `${key}=${value}`;
      }),
    ].join(" ");
  }
}
