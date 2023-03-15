import { Component } from "projen";
import { TypeScriptProject } from "projen/lib/typescript";
import { Fracture } from "./core";

export class ExampleApp extends Component {
  constructor(project: TypeScriptProject) {
    super(project);

    /***************************************************************************
     *  Setup and configure Fracture
     **************************************************************************/

    const fracture = new Fracture(project, "example", {
      outdir: "src/example-app",
    });

    fracture.addOrganization({ orgId: "o-abcdef" });
    //org.addAccount({ account: "0000000000" });

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
    const tenant = tenantService.addResource({ name: "tenant" });
    const name = tenant.addResourceAttribute({
      name: "name",
      shortName: "n",
      isRequired: true,
    });
    tenant.addResourceAttribute({
      name: "nickname",
      shortName: "nn",
    });
    tenant.addLookupSource(name);

    const actor = tenantService.addResource({ name: "actor" });
    const firstName = actor.addResourceAttribute({
      name: "first-name",
      shortName: "fn",
      isRequired: true,
    });
    const lastName = actor.addResourceAttribute({
      name: "last-name",
      shortName: "ln",
      isRequired: true,
    });
    actor.addLookupSource(firstName);
    actor.addLookupSource(lastName);

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
