import { paramCase, pascalCase } from "change-case";
import { Component } from "projen";
import { deepMerge } from "projen/lib/util";
import { Organization } from "./organization";
import { OrganizationalUnit } from "./organizational-unit";

export interface AccountOptions {
  id: string;
  name: string;
  rootEmail?: string;
  isManagementAccount?: boolean;
  organizationalUnit?: OrganizationalUnit;
}

export class Account extends Component {
  // member components
  // parent
  public readonly organization: Organization;
  // all other options
  public readonly options: AccountOptions;

  constructor(organization: Organization, options: AccountOptions) {
    super(organization.project);

    /***************************************************************************
     *
     * INIT OPERATION
     *
     **************************************************************************/

    // parents + inverse
    this.organization = organization;
    this.organization.accounts.push(this);

    const forcedOptions: Partial<AccountOptions> = {
      name: paramCase(options.name),
    };

    // all other options
    const defaultOptions: Partial<AccountOptions> = {
      isManagementAccount: false,
    };

    // all other options
    this.options = deepMerge([
      defaultOptions,
      options,
      forcedOptions,
    ]) as AccountOptions;

    // if OU defined, add account to OU
    if (this.options.organizationalUnit) {
      this.options.organizationalUnit.accounts.push(this);
    }

    // debugging output
    this.project.logger.info(`INIT Account: "${this.id}"`);
  }

  public get id() {
    return this.options.id;
  }

  public get name() {
    return pascalCase(this.options.name);
  }

  public get rootEmail() {
    return this.options.rootEmail;
  }

  public get isManagementAccount() {
    return this.options.isManagementAccount;
  }

  public get organizationalUnit() {
    return this.options.organizationalUnit;
  }
}
