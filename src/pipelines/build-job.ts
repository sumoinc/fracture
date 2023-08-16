import { paramCase } from "change-case";
import { Job, JobOptions } from "./job";
import { Fracture } from "../core";

export interface BuildJobOptions extends JobOptions {
  /**
   * The command to run to build the project.
   *
   * @default "npx projen build"
   */
  buildCommand?: string;
  /**
   * Steps to run before the build command is executed.
   *
   * @default []
   */
  preBuildSteps?: JobStep[];
  /**
   * Steps to run before the build command is executed.
   *
   * @default []
   */
  postBuildSteps?: JobStep[];
  /**
   * The command to run to synth the project.
   *
   * @default "npx projen synth"
   */
  synthCommand?: string;
  /**
   * Steps to run before the synth command is executed.
   *
   * @default []
   */
  preSynthSteps?: JobStep[];
  /**
   * Steps to run before the synth command is executed.
   *
   * @default []
   */
  postSynthSteps?: JobStep[];
}

export class BuildJob extends Job {
  /**
   * Machine readable id for this step
   */
  public readonly id: string;
  /**
   * Human readable name for this step
   */
  public readonly name: string;

  constructor(fracture: Fracture, options: JobOptions) {
    super(fracture);

    /***************************************************************************
     * Props
     **************************************************************************/

    this.name = options.name;
    this.id = paramCase(this.name);
  }
}
