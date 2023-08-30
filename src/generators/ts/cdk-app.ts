import { FractureService } from "../../core/fracture-service";
import { GeneratedTypescriptFile } from "../generated-typescript-file";

export class GenerateCdkApp extends GeneratedTypescriptFile {
  constructor(service: FractureService) {
    super(service, "main.ts");
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
