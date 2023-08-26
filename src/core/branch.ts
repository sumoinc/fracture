import { Component } from "projen";
import { Fracture } from "./fracture";

/**
 * Strategy for one individual branch
 */
export interface BranchOptions {
  /**
   * The branch name.
   */
  name: string;
  /**
   * A shorter name to use when generating code.
   *
   * @default name
   */
  shortName?: string;
}

export class Branch extends Component {
  /**
   * Returns a branch by name, or undefined if it doesn't exist
   */
  public static byName(fracture: Fracture, name: string): Branch | undefined {
    const isTypescriptStrategy = (c: Component): c is Branch =>
      c instanceof Branch && c.name === name;
    return fracture.components.find(isTypescriptStrategy);
  }

  /**
   * The branch name.
   */
  public readonly name: string;
  /**
   * A shorter name to use when generating code.
   *
   * @default name
   */
  public readonly shortName: string;

  constructor(fracture: Fracture, options: BranchOptions) {
    super(fracture);

    /***************************************************************************
     * Props
     **************************************************************************/

    this.name = options.name;
    this.shortName = options.shortName ?? options.name;
  }
}
