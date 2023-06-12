import { Component } from "projen";
import { FractureApp } from "./fracture-app";
import { Stage, StageOptions } from "./stage";
import { Wave, WaveOptions } from "./wave";

export interface PipelineOptions {
  name: string;
  branchTriggerPattern: string;
}

export class Pipeline extends Component {
  // all other options
  public readonly options: PipelineOptions;
  public readonly waves: Wave[] = [];

  constructor(app: FractureApp, options: PipelineOptions) {
    super(app.project);

    this.options = options;

    // inverse
    app.pipelines.push(this);

    // debugging output
    this.project.logger.info(`INIT Pipeline: "${this.name}"`);
  }

  public get name() {
    return this.options.name;
  }

  public get branchTriggerPattern() {
    return this.options.branchTriggerPattern;
  }

  public addWave(options: WaveOptions) {
    return new Wave(this, options);
  }

  public addStage(options: StageOptions) {
    const wave = this.addWave({ name: "default" });
    return new Stage(wave, options);
  }
}
