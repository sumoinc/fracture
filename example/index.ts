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
     *  User Service
     **************************************************************************/

    const userService = fracture.addService({ name: "user" });
    userService
      .addEntity({ name: "user" })
      .addAttribute({ name: "first-name", shortName: "fn" })
      .addAttribute({ name: "last-name", shortName: "ln" });

    userService
      .addEntity({ name: "group" })
      .addAttribute({ name: "name", isRequired: true });

    /***************************************************************************
     *  Tenant Service
     **************************************************************************/

    const tenantService = fracture.addService({ name: "tenant" });
    tenantService
      .addEntity({ name: "tenant" })
      .addAttribute({ name: "name", isRequired: true });
  }
}
