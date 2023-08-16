import { paramCase } from "change-case";
import { Component } from "projen";
import { Fracture } from "../core";

export interface JobOptions {
  /**
   * Human readable name for this step
   */
  name: string;
}

export class Job extends Component {
  /**
   * Machine readable id for this step
   */
  public readonly id: string;
  /**
   * Human readable name for this step
   */
  public readonly name: string;
  /**
   *
   * @param fracture
   * @param options
   */
  public jobSteps: JobStep[] = [];

  constructor(fracture: Fracture, options: JobOptions) {
    super(fracture);

    /***************************************************************************
     * Props
     **************************************************************************/

    this.name = options.name;
    this.id = paramCase(this.name);
  }
}
