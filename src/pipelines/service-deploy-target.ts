import { paramCase } from "change-case";
import { Component } from "projen";
import { Pipeline } from "./pipeline";
import { FractureService } from "../core";
import { Environment } from "../core/environment";
import { Fracture } from "../core/fracture";

export interface ServiceDeployTargetOptions {
  /**
   * The branch name this deployment is targeting.
   * Either branchName or pipeline must be included.
   */
  branchName?: string;
  /**
   * The pipeline this deployment is targeting.
   * Either branchName or pipeline must be included.
   */
  pipeline?: Pipeline;
  /**
   * The environment name this deployment is targeting.
   * Either environmentName or environment must be included.
   */
  environmentName?: string;
  /**
   * The environment this deployment is targeting.
   * Either environmentName or environment must be included.
   */
  environment?: Environment;
  /**
   * Service name this deployment is targeting.
   * Either serviceName or service must be included.
   */
  serviceName?: string;
  /**
   * Service this deployment is targeting.
   * Either serviceName or service must be included.
   */
  service?: FractureService;
}

export class ServiceDeployTarget extends Component {
  /**
   * Returns an deploy target by name, or undefined if it doesn't exist
   */
  public static byName(
    fracture: Fracture,
    name: string
  ): ServiceDeployTarget | undefined {
    const isDefined = (c: Component): c is ServiceDeployTarget =>
      c instanceof ServiceDeployTarget && c.name === name;
    return fracture.components.find(isDefined);
  }
  /**
   * All deploy targets for the given pipeline
   */
  public static byPipeline(pipeline: Pipeline): ServiceDeployTarget[] {
    const fracture = pipeline.project as Fracture;
    const isDefined = (c: Component): c is ServiceDeployTarget =>
      c instanceof ServiceDeployTarget && c.pipeline === pipeline;
    return fracture.components.filter(isDefined);
  }
  /**
   * All deploy targets for the given service
   */
  public static byService(service: FractureService): ServiceDeployTarget[] {
    const fracture = service.parent as Fracture;
    const isDefined = (c: Component): c is ServiceDeployTarget =>
      c instanceof ServiceDeployTarget && c.service === service;
    return fracture.components.filter(isDefined);
  }
  /**
   * Returns all service deploy targets
   */
  public static all(fracture: Fracture): ServiceDeployTarget[] {
    const isDefined = (c: Component): c is ServiceDeployTarget =>
      c instanceof ServiceDeployTarget;
    return fracture.components.filter(isDefined);
  }
  /**
   * This becomes the name for the stack when it's generated.
   */
  public readonly name: string;
  /**
   * Name of the deployment job for this target.
   */
  public readonly deployJobName: string;
  /**
   * Other jobs that must finish before this deploy job can run.
   *
   * @default ['build']
   */
  public readonly needs: string[];
  /**
   * The pattern to use when deploying stacks for this target
   */
  public readonly stackPattern: string;
  /**
   * Name for this pipeline.
   */
  public readonly env: {
    account: string;
    region: string;
  };
  /**
   * The environment to deploy to.
   */
  public readonly environment: Environment;
  /**
   * The environment to deploy to.
   */
  public readonly pipeline: Pipeline;
  /**
   * Service this target is for.
   */
  public readonly service: FractureService;
  /**
   * Other targets this deployment depends on.
   */

  constructor(fracture: Fracture, options: ServiceDeployTargetOptions) {
    /***************************************************************************
     * Resolve optional inputs
     **************************************************************************/

    if (
      (!options.branchName && !options.pipeline) ||
      (options.branchName && options.pipeline)
    ) {
      throw new Error(
        `Exactly one of "branchName" or "pipeline" are required.`
      );
    }

    if (
      (!options.environmentName && !options.environment) ||
      (options.environmentName && options.environment)
    ) {
      throw new Error(
        `Exactly one of "environmentName" or "environment" are required.`
      );
    }

    if (
      (!options.serviceName && !options.service) ||
      (options.serviceName && options.service)
    ) {
      throw new Error(
        `Exactly one of "serviceName" or "service" are required.`
      );
    }

    if (options.branchName) {
      options.pipeline =
        Pipeline.byBranchName(fracture, options.branchName) ??
        new Pipeline(fracture, {
          branchName: options.branchName,
        });
    }

    if (options.environmentName) {
      options.environment =
        Environment.byName(fracture, options.environmentName) ??
        new Environment(fracture, {
          name: options.environmentName,
        });
    }

    if (options.serviceName) {
      options.service =
        FractureService.byName(fracture, options.serviceName) ??
        new FractureService(fracture, {
          name: options.serviceName,
        });
    }

    /***************************************************************************
     * Check Duplicates
     **************************************************************************/

    const name = `${paramCase(options.service!.name)}-${paramCase(
      options.pipeline!.branchName
    )}-${paramCase(options.environment!.name)}`;

    if (ServiceDeployTarget.byName(fracture, name)) {
      throw new Error(`Duplicate deploy target "${name}".`);
    }

    super(fracture);

    /***************************************************************************
     * Props
     **************************************************************************/

    this.name = name;
    this.deployJobName = `deploy-${this.name}`;
    this.needs = ["build"];
    this.stackPattern = `*-${paramCase(
      options.pipeline!.branchName
    )}-${paramCase(options.environment!.name)}`;
    this.env = {
      account: options.environment!.accountNumber,
      region: options.environment!.region,
    };

    this.environment = options.environment!;
    this.pipeline = options.pipeline!;
    this.service = options.service!;
  }

  dependsOn(target: ServiceDeployTarget): ServiceDeployTarget {
    this.needs.push(target.deployJobName);
    return this;
  }
}
