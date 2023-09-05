import { TextFile, TextFileOptions } from "projen";
import { FractureService } from "../../core/fracture-service";
import { Operation } from "../../core/operation.ts-disabled";

export class TypescriptLambdaApiGatewayHandler extends TextFile {
  constructor(
    service: FractureService,
    filePath: string,
    options: TextFileOptions & { operation: Operation }
  ) {
    super(service, filePath, options);
  }

  synthesize(): void {
    this.addLine("// TODO - add code");

    super.synthesize();
  }
}
