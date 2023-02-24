import { Component, Project } from "projen";
import { Fracture } from "../src";
export class ExampleApp extends Component {
  constructor(project: Project) {
    super(project);

    /***************************************************************************
     *  Setup and configure Fracture
     **************************************************************************/

    const fracture = new Fracture(project, "foo", { outdir: "example" });

    fracture
      .addOrganization({ orgId: "o-abcdef" })
      .addAccount({ account: "000000000000" });

    /***************************************************************************
     *  Build the model
     **************************************************************************/

    fracture
      .addEntity({ name: "user" })
      .addAttribute({ name: "first-name", shortName: "fn" })
      .addAttribute({ name: "last-name", shortName: "ln" });

    fracture
      .addEntity({ name: "group" })
      .addAttribute({ name: "name", isRequired: true });

    /***************************************************************************
     *  Build some services
     **************************************************************************/

    fracture.addService({ name: "foo" });
    fracture.addService({ name: "bar" });
  }
}
