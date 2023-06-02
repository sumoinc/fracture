import { Component } from "projen";
import { FractureProject } from "../core";

export class TurboRepo extends Component {
  constructor(fractureProject: FractureProject) {
    super(fractureProject);

    fractureProject.addGitIgnore(".turbo");
  }
}
