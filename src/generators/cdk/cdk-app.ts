import { join } from "path";
import { Service } from "../../core/service";
import { TypeScriptSource } from "../ts/typescript-source";

export class CdkApp extends TypeScriptSource {
  public readonly service: Service;

  constructor(service: Service) {
    super(service, join(service.srcDir, "ts", "app.ts"));

    // remember this service name
    this.service = service;
  }

  /*
  preSynthesize(): void {
    this.line(`import { execSync } from "child_process";`);
    this.line(`import { App, Stack } from "aws-cdk-lib";`);
    this.line("");

    // determine build identifier using git branch name
    this.lines([
      'const branchName = execSync("git rev-parse --abbrev-ref HEAD").toString("utf8").replace(/[\\n\\rs]+$/, "");',
      `const branchPath = branchName.split("/");`,
      `const buildId = branchPath[branchPath.length - 1];`,
    ]);
    this.line("");

    // determine service name
    this.line(`const serviceName = "${this.service.name}";`);
    this.line("");

    // create app
    this.line(`const app = new App();`);

    // create stack
    this.line(`const stack = new Stack(app, \`\${serviceName}-\${buildId}\`);`);

    super.preSynthesize();
  }
  */
}
