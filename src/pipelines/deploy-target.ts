import { paramCase } from "change-case";
import { Component } from "projen";
import { FractureService } from "../core";
import { Branch } from "../core/branch";
import { Environment } from "../core/environment";
import { Fracture } from "../core/fracture";

export interface DeployTargetOptions {
  /**
   * Branch this target is for.
   */
  branch: Branch;
  /**
   * The environment to deploy to.
   */
  environment: Environment;
  /**
   * Service this target is for.
   */
  service: FractureService;
}

export class DeployTarget extends Component {
  /**
   * This becomes the name for the stack when it's generated.
   */
  public readonly name: string;
  /**
   * Name for this pipeline.
   */
  public readonly env: {
    account: string;
    region: string;
  };
  /**
   * Service this target is for.
   */
  public readonly service: FractureService;

  constructor(fracture: Fracture, options: DeployTargetOptions) {
    super(fracture);

    /***************************************************************************
     * Props
     **************************************************************************/

    this.name = `${paramCase(options.service.name)}-${paramCase(
      options.branch.name
    )}-${paramCase(options.environment.name)}`;
    this.env = {
      account: options.environment.account.accountNumber,
      region: options.environment.region,
    };
    this.service = options.service;
  }
}
