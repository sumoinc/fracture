import { paramCase } from "change-case";
import { Component } from "projen";
import { Fracture } from "../core";
import { Pipeline } from "../pipelines";

export interface NetlifyOptions {
  /**
   *
   * Name base for deployment pipelines
   *
   * @default "netlify"
   */
  nameBase?: string;
  /**
   * Name of production branch to trigger deployments
   *
   * @default fracture.defaultReleaseBranch
   */
  productionBranchName?: string;
}

export class Netlify extends Component {
  /**
   *
   * Name base for deployment pipelines
   *
   * @default "netlify"
   */
  public readonly nameBase: string;
  /**
   * Name of production branch to trigger deployments
   *
   * @default fracture.defaultReleaseBranch
   */
  public readonly productionBranchName: string;

  constructor(fracture: Fracture, options: NetlifyOptions) {
    super(fracture);

    /***************************************************************************
     * Props
     **************************************************************************/

    this.nameBase = options.nameBase ?? "netlify";
    this.productionBranchName =
      options.productionBranchName ?? fracture.defaultReleaseBranch;

    /***************************************************************************
     * Create production deployment pipeline with netlify as the target
     **************************************************************************/

    const prodPipeline = new Pipeline(fracture, {
      name: paramCase(`${this.nameBase}-deploy-${this.productionBranchName}`),
      branchTriggerPatterns: [this.productionBranchName],
    });

    prodPipeline.addJob({
      name: "deploy",
      steps: [
        {
          name: "Deploy to Netlify",
          uses: "netlify/actions/cli@master",
          with: {
            args: "deploy --dir=.output/public --prod",
          },
          env: {
            NETLIFY_SITE_ID: "${{ secrets.NETLIFY_SITE_ID }}",
            NETLIFY_AUTH_TOKEN: "${{ secrets.NETLIFY_AUTH_TOKEN }}",
          },
        },
      ],
    });
  }
}
