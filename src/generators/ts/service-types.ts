import ts from "typescript";
import { TypeFactory } from "./factories/type";
import { TypeScriptSource, TypeScriptSourceOptions } from "./source";
import { FractureService } from "../../core/fracture-service";

export interface TypescriptServiceTypesOptions extends TypeScriptSourceOptions {
  /**
   * The service we're generating types for.
   */
  service: FractureService;
}

export class TypescriptServiceTypes extends TypeScriptSource {
  /**
   * The service we're generating types for.
   */
  public readonly service: FractureService;

  constructor(
    service: FractureService,
    filePath: string,
    options: TypescriptServiceTypesOptions
  ) {
    super(service, filePath, options);

    /***************************************************************************
     * Props
     **************************************************************************/

    this.service = options.service;
  }

  synthesize(): void {
    /***************************************************************************
     * Common Types
     **************************************************************************/

    const service = this.project as FractureService;
    const types = TypeFactory.toTypes({
      service,
      structures: service.structures,
    });
    /*
    const typeArray = service.structures.map((structure) => {
      // in case of MyType<T> or similar
      const typeParameter = structure.typeParameter
        ? [
            factory.createTypeParameterDeclaration(
              undefined,
              factory.createIdentifier(structure.typeParameter),
              undefined,
              undefined
            ),
          ]
        : undefined;

      // build properties for this type
      const properties = TypeAttributeFactory.toTypeProperies({
        service,
        attributes: structure.attributes,
      });

      // define the type
      const type = factory.createTypeAliasDeclaration(
        [factory.createToken(ts.SyntaxKind.ExportKeyword)],
        factory.createIdentifier(this.strategy.formatTypeName(structure.name)),
        typeParameter,
        properties
      );

      // add comments if needed
      if (structure.comments.length) {
        addSyntheticLeadingComment(
          type,
          ts.SyntaxKind.MultiLineCommentTrivia,
          `*\n * ${structure.comments.join("\n * ")}\n`,
          true
        );
      }

      return type;
    });
    */

    // this.open(`export type Error = {`);
    // this.line(`code: number;`);
    // this.line(`source: string;`);
    // this.line(`message: string;`);
    // this.line(`detail: string;`);
    // this.close(`}`);
    // this.line("");

    // this.open(`export type ${this.strategy.formatTypeName("response")}<T> = {`);
    // this.line(`data?: T;`);
    // this.line(`errors: Error[];`);
    // this.line(`status: number;`);
    // this.close(`}`);
    // this.line("");

    // this.open(
    //   `export type ${this.strategy.formatTypeName("list-response")}<T> = {`
    // );
    // this.line(`data?: T[];`);
    // this.line(`errors: Error[];`);
    // this.line(`status: number;`);
    // this.close(`}`);
    // this.line("");

    function print(nodes: any) {
      const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
      const resultFile = ts.createSourceFile(
        "temp.ts",
        "",
        ts.ScriptTarget.Latest,
        false,
        ts.ScriptKind.TS
      );

      console.log(
        printer.printList(ts.ListFormat.MultiLine, nodes, resultFile)
      );
    }

    print(types);

    super.synthesize();
  }
}
