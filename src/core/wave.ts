import { Component } from "projen";
import { Pipeline } from "./pipeline";
import { Stage, StageOptions } from "./stage";

export interface WaveOptions {
  name: string;
}

export class Wave extends Component {
  // all other options
  public readonly options: WaveOptions;
  public readonly stages: Stage[] = [];

  constructor(pipeline: Pipeline, options: WaveOptions) {
    super(pipeline.project);

    this.options = options;

    // inverse
    pipeline.waves.push(this);

    // debugging output
    this.project.logger.info(`INIT Wave: "${this.name}"`);
  }

  public get name() {
    return this.options.name;
  }

  public addStage(options: StageOptions) {
    return new Stage(this, options);
  }
}
