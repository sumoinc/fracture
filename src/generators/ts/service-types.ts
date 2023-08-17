import ts from "typescript";
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

    this.open(`export type Error = {`);
    this.line(`code: number;`);
    this.line(`source: string;`);
    this.line(`message: string;`);
    this.line(`detail: string;`);
    this.close(`}`);
    this.line("");

    this.open(`export type ${this.strategy.formatTypeName("response")}<T> = {`);
    this.line(`data?: T;`);
    this.line(`errors: Error[];`);
    this.line(`status: number;`);
    this.close(`}`);
    this.line("");

    this.open(
      `export type ${this.strategy.formatTypeName("list-response")}<T> = {`
    );
    this.line(`data?: T[];`);
    this.line(`errors: Error[];`);
    this.line(`status: number;`);
    this.close(`}`);
    this.line("");

    const aId = ts.factory.createIdentifier("a");
    const bId = ts.factory.createIdentifier("b");
    const addId = ts.factory.createIdentifier("add");
    const numberKeyword = ts.factory.createKeywordTypeNode(
      ts.SyntaxKind.NumberKeyword
    );

    const addFunc = ts.factory.createFunctionDeclaration(
      undefined,
      undefined,
      addId,
      undefined,
      [
        ts.factory.createParameterDeclaration(
          undefined,
          undefined,
          aId,
          undefined,
          numberKeyword,
          undefined
        ),
        ts.factory.createParameterDeclaration(
          undefined,
          undefined,
          bId,
          undefined,
          numberKeyword,
          undefined
        ),
      ],
      numberKeyword,
      ts.factory.createBlock(
        [
          ts.factory.createReturnStatement(
            ts.factory.createBinaryExpression(
              aId,
              ts.factory.createToken(ts.SyntaxKind.PlusToken),
              bId
            )
          ),
        ],
        true
      )
    );

    function print(nodes: any) {
      const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
      const resultFile = ts.createSourceFile(
        "temp.ts",
        "",
        ts.ScriptTarget.Latest,
        false,
        ts.ScriptKind.TSX
      );

      console.log(
        printer.printList(ts.ListFormat.MultiLine, nodes, resultFile)
      );
    }

    print([addFunc]);

    super.synthesize();
  }
}
