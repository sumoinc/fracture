import { Component } from "projen";
import { Fracture } from "./fracture";
import { PipelineWorkflow } from "./pipeline-workflow";
import { StageOptions } from "./stage";
import { Wave, WaveOptions } from "./wave";

export interface PipelineOptions {
  name: string;
  branchTriggerPatterns: string[];
  //app: FractureApp;
}

export class Pipeline extends Component {
  // all other options
  public readonly options: PipelineOptions;
  public readonly waves: Wave[] = [];

  /**
   * Because the github workflow is build on the base project we pass in the app
   * but the component is actually based the root project
   */
  constructor(fracture: Fracture, options: PipelineOptions) {
    super(fracture);

    this.options = options;

    // inverse
    //this.app.pipelines.push(this);

    // init workflow for this pipeline
    new PipelineWorkflow(fracture, {
      pipeline: this,
    });

    // debugging output
    this.project.logger.info(`INIT Pipeline: "${this.name}"`);
  }

  public get name() {
    return this.options.name;
  }

  public get deployName() {
    return `deploy-${this.name}`;
  }

  public get branchTriggerPatterns() {
    return this.options.branchTriggerPatterns;
  }

  /*
  public get app() {
    return this.options.app;
  }
  */

  public get stages() {
    return this.waves.flatMap((wave) => wave.stages);
  }

  public addWave(options: WaveOptions) {
    return new Wave(this, options);
  }

  public addStage(options: StageOptions) {
    const wave = this.addWave({ name: "default" });
    return wave.addStage(options);
  }
}
