import { Service } from "../../services/service";
import { GeneratedTypescriptFile } from "../generated-typescript-file";

export class GenerateCdkApp extends GeneratedTypescriptFile {
  constructor(public readonly project: Service) {
    super(project, "main.ts");
  }

  preSynthesize(): void {
    const lines = [
      "import { App, Stack } from 'aws-cdk-lib';",
      "import { Queue } from 'aws-cdk-lib/aws-sqs';",
      "",
      "export class GeneratedApp extends App {",
      "  constructor() {",
      "    super();",
      "",
      "    const stack = new Stack(this, 'my-stack');",
      "    new Queue(stack, 'foo')",
      "",
      "  }",
      "}",
      "",
    ];

    lines.forEach((line) => {
      this.addLine(line);
    });

    super.preSynthesize();
  }
}
