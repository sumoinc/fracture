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
      .addShape({ name: "user" })
      .addShapeAttribute({ name: "first-name", shortName: "fn" })
      .addShapeAttribute({ name: "last-name", shortName: "ln" });

    userService
      .addShape({ name: "group" })
      .addShapeAttribute({ name: "name", isRequired: true });

    /***************************************************************************
     *  Tenant Service
     **************************************************************************/

    const tenantService = fracture.addService({ name: "tenant" });
    tenantService
      .addShape({ name: "tenant" })
      .addShapeAttribute({ name: "name", isRequired: true });

    tenantService
      .addShape({ name: "saas-identity", persistant: false })
      .addShapeAttribute({ name: "actor-type" })
      .addShapeAttribute({ name: "actor" })
      .addShapeAttribute({ name: "scope" });
  }
}
