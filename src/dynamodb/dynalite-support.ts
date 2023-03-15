import { Fracture, FractureComponent } from "../core";
import { TypeScriptSource } from "../generators/ts/typescript-source";

export class DynaliteSupport extends FractureComponent {
  public readonly dynaliteConfig: TypeScriptSource;

  constructor(fracture: Fracture) {
    super(fracture);

    const { project } = this.fracture;

    // add dynalite
    project.addDevDeps("jest-dynalite");

    this.dynaliteConfig = new TypeScriptSource(this, "jest-dynalite-config.js");
    return this;
  }

  // build out the dynalite config
  preSynthesize() {
    const config = {
      tables: this.fracture.services.map((service) => {
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
          GlobalSecondaryIndexes: service.dynamoTable.dynamoGsi
            .filter((gsi) => gsi !== service.dynamoTable.keyDynamoGsi)
            .map((gsi) => {
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
            }),
        };
      }),
    };

    this.dynaliteConfig.line(
      `module.exports = ${JSON.stringify(config, null, 2)};`
    );

    this.dynaliteConfig.line("");
    super.preSynthesize();
  }
}
