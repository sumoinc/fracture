import { Component } from "projen";
import { Fracture } from "../fracture";

export type AttributeNamingStrategyOptions = {
  compositionSeperator?: string;
};

export class AttributeNamingStrategy extends Component {
  public readonly compositionSeperator?: string;

  constructor(
    fracture: Fracture,
    options: AttributeNamingStrategyOptions = {}
  ) {
    super(fracture);

    /***************************************************************************
     * PROPS
     **************************************************************************/

    this.compositionSeperator = options.compositionSeperator ?? "#";
  }
}
