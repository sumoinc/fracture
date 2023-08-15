import { Component } from "projen";
import { Fracture } from "./fracture";

export interface PipelineOptions {
  /**
   * Name for this pipeline.
   */
  name: string;
  /**
   * What branches shoudl trigger this pipeline?
   */
  branchTriggerPatterns: string[];
  /**
   * What paths should trigger this pipeline?
   *
   * @default [] (all)
   */
  pathTriggerPatterns?: string[];
  /**
   * Allow this pipeline to be triggered manually?
   *
   * @default true
   */
  manualTrigger?: boolean;
  /**
   * Should this pipeline deploy the app after build?
   *
   * @default false
   */
  deploy?: boolean;
}

export class Pipeline extends Component {
  /**
   * Name for this pipeline.
   */
  public readonly name: string;
  /**
   * What branches shoudl trigger this pipeline?
   */
  public readonly branchTriggerPatterns: string[];
  /**
   * What paths should trigger this pipeline?
   *
   * @default [] (all)
   */
  public readonly pathTriggerPatterns: string[];
  /**
   * Allow this pipeline to be triggered manually?
   *
   * @default true
   */
  public readonly manualTrigger: boolean;
  /**
   * Should this pipeline deploy the app after build?
   *
   * @default false
   */
  public readonly deploy: boolean;

  constructor(fracture: Fracture, options: PipelineOptions) {
    super(fracture);

    /***************************************************************************
     * Props
     **************************************************************************/

    this.name = options.name;
    this.branchTriggerPatterns = options.branchTriggerPatterns;
    this.pathTriggerPatterns = options.pathTriggerPatterns ?? [];
    this.manualTrigger = options.manualTrigger ?? true;
    this.deploy = options.deploy ?? false;

    // debugging output
    //this.project.logger.info(`INIT Pipeline: "${this.name}"`);
  }

  /*
  public get stages() {
    return this.waves.flatMap((wave) => wave.stages);
  }

  public addWave(options: WaveOptions) {
    const wave = new Wave(this.project as Fracture, options);
    this.waves.push(wave);
    return wave;
  }

  public addStage(options: StageOptions) {
    const wave =
      this.waves.length === 0
        ? this.addWave({ name: "default" })
        : this.waves[this.waves.length - 1];
    return wave.addStage(options);
  }
  */
}
