import { FractureComponent } from "../core/component";
import { FracturePackage } from "../core/fracture-package";
import { TypeScriptSource } from "../generators/ts/typescript-source";

export class DynaliteSupport extends FractureComponent {
  /**
   *
   * Writes a dynalite testable dynamo client to a typescript input file.
   *
   * @param file {TypeScriptSource}
   */
  static writeDynamoClient(file: TypeScriptSource, name: string = "dynamo") {
    file.comments([
      "Generate a DynamoDB client, configure it to use a local endpoint when needed",
      "to support unit testing with dynalite.",
      "",
      "https://www.npmjs.com/package/jest-dynalite",
    ]);
    file.open(`const config = {`);
    file.open(`...(process.env.MOCK_DYNAMODB_ENDPOINT && {`);
    file.line(`endpoint: process.env.MOCK_DYNAMODB_ENDPOINT,`);
    file.line(`sslEnabled: false,`);
    file.line(`region: 'local',`);
    file.close(`}),`);
    file.close(`}`);
    file.lines([
      `const client = new DynamoDBClient(config);`,
      `const ${name} = DynamoDBDocumentClient.from(client);`,
      ``,
    ]);
  }

  /**
   *
   * Writes imports required for dynalite support
   *
   * @param file {TypeScriptSource}
   */
  static writeJestImports(file: TypeScriptSource) {
    file.line(
      `import { createTables, deleteTables, startDb, stopDb, } from "jest-dynalite";`
    );
  }

  /**
   *
   * Writes a dynalite configuration used in jest tests
   *
   * @param file {TypeScriptSource}
   */
  static writeJestConfig(file: TypeScriptSource) {
    file.comments([
      "Sometimes dynalite tests can require a little additional",
      "time when you are running a lot of them in parallel.",
      "",
      "https://www.npmjs.com/package/jest-dynalite",
    ]);
    file.line("jest.setTimeout(10000);");
    file.line("");

    file.comments([
      "Starts and stops dynalite for each test",
      "",
      "https://www.npmjs.com/package/jest-dynalite",
    ]);
    file.line("beforeAll(startDb);");
    file.line("beforeEach(createTables);");
    file.line("afterEach(deleteTables);");
    file.line("afterAll(stopDb);");
    file.line("");
  }

  public readonly dynaliteConfig: TypeScriptSource;

  constructor(fracturePackage: FracturePackage) {
    super(fracturePackage);

    const { project } = this.fracturePackage;

    // add dynalite
    project.addDeps("jest-dynalite");
    // dynalite wants this peer fopr marshalling
    project.addPeerDeps("aws-sdk@^2.1336.0");

    this.dynaliteConfig = new TypeScriptSource(this, "jest-dynalite-config.js");

    // add dynalite setup to jest config
    const setupBeforeEnv = new TypeScriptSource(this, "setupBeforeEnv.ts");
    setupBeforeEnv.line(`import { setup } from "jest-dynalite";`);
    setupBeforeEnv.line("");
    setupBeforeEnv.line("// look for jest-dynalite-config.js in root");
    setupBeforeEnv.line(`setup(__dirname);`);
    setupBeforeEnv.line("");

    // add setup to the jest config
    project.jest!.addSetupFile("./setupBeforeEnv.ts");

    return this;
  }

  // build out the dynalite config
  preSynthesize() {
    const config = {
      tables: this.fracturePackage.services.map((service) => {
        const allGsi = service.dynamoTable.dynamoGsi.filter(
          (gsi) => gsi !== service.dynamoTable.keyDynamoGsi
        );
        return {
          TableName: service.dynamoTable.name,
          KeySchema: [
            {
              AttributeName: service.dynamoTable.pkName,
              KeyType: "HASH",
            },
            {
              AttributeName: service.dynamoTable.skName,
              KeyType: "RANGE",
            },
          ],
          AttributeDefinitions: service.dynamoTable.attrributeNames.map((s) => {
            return {
              AttributeName: s,
              AttributeType: "S",
            };
          }),
          GlobalSecondaryIndexes:
            allGsi.length > 0
              ? allGsi.map((gsi) => {
                  return {
                    IndexName: gsi.name,
                    KeySchema: [
                      {
                        AttributeName: gsi.pkName,
                        KeyType: "HASH",
                      },
                      {
                        AttributeName: gsi.skName,
                        KeyType: "RANGE",
                      },
                    ],
                    Projection: {
                      ProjectionType: "ALL",
                    },
                  };
                })
              : undefined,
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
        };
      }),
      basePort: 8000 + this.fracturePackage.packageIndex * 100,
    };

    this.dynaliteConfig.line(
      `module.exports = ${JSON.stringify(config, null, 2)};`
    );

    this.dynaliteConfig.line("");
    super.preSynthesize();
  }
}
