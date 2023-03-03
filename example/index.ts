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
    /*
    const userService = fracture.addService({ name: "user" });
    userService
      .addResource({ name: "user" })
      .addResourceAttribute({ name: "first-name", shortName: "fn" })
      .addResourceAttribute({ name: "last-name", shortName: "ln" });

    userService
      .addResource({ name: "group" })
      .addResourceAttribute({ name: "name", isRequired: true });
*/
    /***************************************************************************
     *  Tenant Service
     **************************************************************************/

    const tenantService = fracture.addService({ name: "tenant" });
    tenantService
      .addResource({ name: "tenant" })
      .addResourceAttribute({ name: "name", isRequired: true });
    /*
    tenantService
      .addResource({ name: "saas-identity", persistant: false })
      .addResourceAttribute({ name: "actor-type" })
      .addResourceAttribute({ name: "actor" })
      .addResourceAttribute({ name: "scope" });
*/
    // build out defaults
    fracture.build();
  }
}
