import { DynamoAttribute } from "./dynamo-attribute";
import { DynamoGsi } from "./dynamo-gsi";
import { Fracture, FractureService } from "../core";
import { TypeScriptSource } from "../generators/ts/typescript-source";

export const addDynaliteSupport = (service: FractureService) => {
  // add setup to the jest config
  service.jest!.addSetupFile("./setupBeforeEnv.ts");

  // build root level config (jest-dynalite-config.js) file
  new DynaliteConfig(service);

  // setup file to allow jest to run tests against dynalite
  new DynaliteJestSupport(service);
};

export class DynaliteConfig extends TypeScriptSource {
  constructor(service: FractureService) {
    super(service, "jest-dynalite-config.js");

    // add dynalite
    service.addDeps("jest-dynalite");
    // dynalite wants this specific peer version for marshalling
    service.addPeerDeps("aws-sdk@^2.1336.0");

    return this;
  }

  // build out the dynalite config
  synthesize() {
    super.synthesize();

    const service = this.project as FractureService;
    const fracture = service.parent as Fracture;
    const { gsi, keyGsi } = service.dynamoTable;
    const otherGsi = gsi.filter((g: DynamoGsi) => g.name !== keyGsi.name);
    const serviceIndex = fracture.services.indexOf(service);
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
          TableName: service.dynamoTable.name,
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
  constructor(service: FractureService) {
    super(service, "setupBeforeEnv.ts");

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
