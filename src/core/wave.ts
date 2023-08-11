import { Component } from "projen";
import { Fracture } from "./fracture";
import { Stage, StageOptions } from "./stage";

export interface WaveOptions {
  /**
   * Name for this wave.
   */
  name: string;
}

export class Wave extends Component {
  /**
   * All stages in this wave
   */
  public readonly stages: Stage[] = [];
  /**
   * Name for this wave.
   */
  public readonly name: string;

  constructor(fracture: Fracture, options: WaveOptions) {
    super(fracture);

    /***************************************************************************
     * Props
     **************************************************************************/

    this.name = options.name;

    // debugging output
    this.project.logger.info(`INIT Wave: "${this.name}"`);
  }

  public addStage(options: StageOptions) {
    const stage = new Stage(this.project as Fracture, options);
    this.stages.push(stage);
    return stage;
  }
}
