import { NodeProject } from "projen/lib/javascript";
import { DynamoAttribute } from "./dynamo-attribute";
import { DynamoGsi } from "./dynamo-gsi";
import { DynamoTable } from "./dynamo-table";
import { TypeScriptSource } from "../generators/ts/source";

export const addDynaliteSupport = (project: NodeProject) => {
  // add setup to the jest config
  project.jest!.addSetupFile("./setupBeforeEnv.ts");

  // build root level config (jest-dynalite-config.js) file
  new DynaliteConfig(project);

  // setup file to allow jest to run tests against dynalite
  new DynaliteJestSupport(project);
};

export class DynaliteConfig extends TypeScriptSource {
  constructor(public readonly project: NodeProject) {
    super(project, "jest-dynalite-config.js");

    // add dynalite
    project.addDeps("jest-dynalite");
    // dynalite wants this specific peer version for marshalling
    //service.addPeerDeps("aws-sdk@^2.1336.0");

    return this;
  }

  // build out the dynalite config
  synthesize() {
    super.synthesize();

    const table = DynamoTable.of(this.project);
    const { gsi, keyGsi } = table;
    const otherGsi = gsi.filter((g: DynamoGsi) => g.name !== keyGsi.name);
    const serviceIndex = 1;
    const allAttributes = gsi.reduce((acc, g) => {
      if (acc.indexOf(g.pk) === -1) {
        acc.push(g.pk);
      }
      if (acc.indexOf(g.sk) === -1) {
        acc.push(g.sk);
      }
      return acc;
    }, [] as DynamoAttribute[]);

    const config = {
      tables: [
        {
          TableName: table.name,
          KeySchema: [
            {
              AttributeName: keyGsi.pk.name,
              KeyType: "HASH",
            },
            {
              AttributeName: keyGsi.sk.name,
              KeyType: "RANGE",
            },
          ],
          AttributeDefinitions: allAttributes.map(
            (attribute: DynamoAttribute) => {
              return {
                AttributeName: attribute.name,
                AttributeType: "S",
              };
            }
          ),
          GlobalSecondaryIndexes:
            otherGsi.length > 0
              ? otherGsi.map((g) => {
                  return {
                    IndexName: g.name,
                    KeySchema: [
                      {
                        AttributeName: g.pk.name,
                        KeyType: "HASH",
                      },
                      {
                        AttributeName: g.sk.name,
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
        },
      ],
      // make sure each service has a unique port
      basePort: 8000 + serviceIndex * 100,
    };

    this.line(`module.exports = ${JSON.stringify(config, null, 2)};`);

    this.line("");
  }
}

export class DynaliteJestSupport extends TypeScriptSource {
  constructor(project: NodeProject) {
    super(project, "setupBeforeEnv.ts");

    this.line(`import { setup } from "jest-dynalite";`);
    this.line("");
    this.line("// look for jest-dynalite-config.js in root");
    this.line(`setup(__dirname);`);
    this.line("");

    return this;
  }
}

/**
 *
 * Writes a dynalite testable dynamo client to a typescript input file.
 *
 * @param file {TypeScriptSource}
 */
//  static writeDynamoClient(file: TypeScriptSource, name: string = "dynamo") {
//   file.comments([
//     "Generate a DynamoDB client, configure it to use a local endpoint when needed",
//     "to support unit testing with dynalite.",
//     "",
//     "https://www.npmjs.com/package/jest-dynalite",
//   ]);
//   file.open(`const config = {`);
//   file.open(`...(process.env.MOCK_DYNAMODB_ENDPOINT && {`);
//   file.line(`endpoint: process.env.MOCK_DYNAMODB_ENDPOINT,`);
//   file.line(`sslEnabled: false,`);
//   file.line(`region: "local",`);
//   file.close(`}),`);
//   file.close(`};`);
//   file.lines([
//     `const client = new DynamoDBClient(config);`,
//     `const ${name} = DynamoDBDocumentClient.from(client);`,
//     ``,
//   ]);
// }

// /**
//  *
//  * Writes imports required for dynalite support
//  *
//  * @param file {TypeScriptSource}
//  */
// static writeJestImports(file: TypeScriptSource) {
//   file.line(
//     `import { createTables, deleteTables, startDb, stopDb, } from "jest-dynalite";`
//   );
// }

// /**
//  *
//  * Writes a dynalite configuration used in jest tests
//  *
//  * @param file {TypeScriptSource}
//  */
// static writeJestConfig(file: TypeScriptSource) {
//   file.comments([
//     "Sometimes dynalite tests can require a little additional",
//     "time when you are running a lot of them in parallel.",
//     "",
//     "https://www.npmjs.com/package/jest-dynalite",
//   ]);
//   file.line("jest.setTimeout(10000);");
//   file.line("");

//   file.comments([
//     "Starts and stops dynalite for each test",
//     "",
//     "https://www.npmjs.com/package/jest-dynalite",
//   ]);
//   file.line("beforeAll(startDb);");
//   file.line("beforeEach(createTables);");
//   file.line("afterEach(deleteTables);");
//   file.line("afterAll(stopDb);");
//   file.line("");
// }
