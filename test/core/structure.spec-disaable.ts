import { LoggerOptions, LogLevel } from "projen";
import { OPERATION_SUB_TYPE, OPERATION_TYPE } from "../../src/core/operation";
import { STRUCTURE_TYPE } from "../../src/core/structure";
import { TestFracture } from "../util";

const makeFixture = () => {
  const logging: LoggerOptions = {
    level: LogLevel.WARN,
  };
  const fracture = new TestFracture({ logging });
  const service = fracture.addService({ name: "tenant" });
  // const service = new Service(fracture, { name: "tenant" });
  const resource = service.addResource({
    name: "person",
    pluralName: "people",
  });
  resource.addResourceAttribute({
    name: "my-name",
    shortName: "mn",
    //isRequired: true,
  });
  const fn = resource.addResourceAttribute({
    name: "first-name",
    shortName: "fn",
    isRequired: true,
  });
  const ln = resource.addResourceAttribute({
    name: "last-name",
    shortName: "ln",
    isRequired: true,
  });
  resource.addLookupSource(fn);
  resource.addLookupSource(ln);
  fracture.build();
  return fracture;
};

const fixture = makeFixture(); //

/*****************************************************************************
 * Expected results for all structure types
 ****************************************************************************/

const expectedStructures = [
  {
    type: STRUCTURE_TYPE.DATA,
    expectedName: "person",
    operationSubType: "",
    attributeTypes: [
      {
        publicAttributes: [
          { id: true },
          { type: true },
          { version: true },
          { "created-at": true },
          { "updated-at": true },
          { "deleted-at": false },
          { "my-name": true },
          { "first-name": true },
          { "last-name": false },
        ],
      },
      { itemAttributes: [] },
      { keyAttributes: [] },
      { generatedAttributes: [] },
    ],
  },
  {
    type: STRUCTURE_TYPE.TRANSIENT,
    expectedName: "person-message",
    operationSubType: "",
    attributeTypes: [
      {
        publicAttributes: [
          { id: true },
          { type: true },
          { version: true },
          { "created-at": true },
          { "updated-at": true },
          { "deleted-at": false },
          { "my-name": true },
          { "first-name": true },
          { "last-name": false },
        ],
      },
      { itemAttributes: [] },
      { keyAttributes: [] },
      { generatedAttributes: [] },
    ],
  },
  /*****************************************************************************
   * CREATE INPUT
   ****************************************************************************/
  {
    type: STRUCTURE_TYPE.INPUT,
    operationSubType: OPERATION_SUB_TYPE.CREATE_ONE,
    expectedName: "create-person-input",
    attributeTypes: [
      {
        publicAttributes: [
          { "my-name": true },
          { "first-name": true },
          { "last-name": false },
        ],
      },
      {
        itemAttributes: [
          { id: true },
          { type: true },
          { version: true },
          { "created-at": true },
          { "updated-at": true },
          { "my-name": true },
          { "first-name": true },
          { "last-name": false },
          { pk: true },
          { sk: true },
          { "lookup-text": true },
        ],
      },
      { keyAttributes: [{ pk: true }, { sk: true }] },
      {
        generatedAttributes: [
          { id: true },
          { type: true },
          { version: true },
          { "created-at": true },
          { "updated-at": true },
          { pk: true },
          { sk: true },
          { "lookup-text": true },
        ],
      },
    ],
  },
  /*****************************************************************************
   * CREATE OUTPUT
   ****************************************************************************/
  {
    type: STRUCTURE_TYPE.OUTPUT,
    operationSubType: OPERATION_SUB_TYPE.CREATE_ONE,
    expectedName: "create-person-output",
    attributeTypes: [
      {
        publicAttributes: [
          { id: true },
          { type: true },
          { version: true },
          { "created-at": true },
          { "updated-at": true },
          { "my-name": true },
          { "first-name": true },
          { "last-name": false },
        ],
      },
      {
        itemAttributes: [],
      },
      { keyAttributes: [] },
      {
        generatedAttributes: [],
      },
    ],
  },
  /*****************************************************************************
   * READ INPUT
   ****************************************************************************/
  {
    type: STRUCTURE_TYPE.INPUT,
    operationSubType: OPERATION_SUB_TYPE.READ_ONE,
    expectedName: "get-person-input",
    attributeTypes: [
      {
        publicAttributes: [{ id: true }],
      },
      {
        itemAttributes: [],
      },
      { keyAttributes: [{ pk: true }, { sk: true }] },
      {
        generatedAttributes: [
          { type: true },
          { version: true },
          { pk: true },
          { sk: true },
        ],
      },
    ],
  },
  /*****************************************************************************
   * READ OUTPUT
   ****************************************************************************/
  {
    type: STRUCTURE_TYPE.OUTPUT,
    operationSubType: OPERATION_SUB_TYPE.READ_ONE,
    expectedName: "get-person-output",
    attributeTypes: [
      {
        publicAttributes: [
          { id: true },
          { type: true },
          { version: true },
          { "created-at": true },
          { "updated-at": true },
          { "my-name": true },
          { "first-name": true },
          { "last-name": false },
        ],
      },
      {
        itemAttributes: [],
      },
      { keyAttributes: [] },
      {
        generatedAttributes: [],
      },
    ],
  },
  /*****************************************************************************
   * UPDATE INPUT
   ****************************************************************************/
  {
    type: STRUCTURE_TYPE.INPUT,
    operationSubType: OPERATION_SUB_TYPE.UPDATE_ONE,
    expectedName: "update-person-input",
    attributeTypes: [
      {
        publicAttributes: [
          { id: true },
          { "my-name": true },
          { "first-name": true },
          { "last-name": false },
        ],
      },
      {
        itemAttributes: [
          { "updated-at": true },
          { "my-name": true },
          { "first-name": true },
          { "last-name": false },
          { "lookup-text": true },
        ],
      },
      { keyAttributes: [{ pk: true }, { sk: true }] },
      {
        generatedAttributes: [
          { type: true },
          { version: true },
          { "updated-at": true },
          { pk: true },
          { sk: true },
          { "lookup-text": true },
        ],
      },
    ],
  },
  /*****************************************************************************
   * UPDATE OUTPUT
   ****************************************************************************/
  {
    type: STRUCTURE_TYPE.OUTPUT,
    operationSubType: OPERATION_SUB_TYPE.UPDATE_ONE,
    expectedName: "update-person-output",
    attributeTypes: [
      {
        publicAttributes: [
          { id: true },
          { type: true },
          { version: true },
          { "created-at": true },
          { "updated-at": true },
          { "my-name": true },
          { "first-name": true },
          { "last-name": false },
        ],
      },
      {
        itemAttributes: [],
      },
      { keyAttributes: [] },
      {
        generatedAttributes: [],
      },
    ],
  },
  /*****************************************************************************
   * DELETE INPUT
   ****************************************************************************/
  {
    type: STRUCTURE_TYPE.INPUT,
    operationSubType: OPERATION_SUB_TYPE.DELETE_ONE,
    expectedName: "delete-person-input",
    attributeTypes: [
      {
        publicAttributes: [{ id: true }],
      },
      {
        itemAttributes: [],
      },
      { keyAttributes: [{ pk: true }, { sk: true }] },
      {
        generatedAttributes: [
          { type: true },
          { version: true },
          { pk: true },
          { sk: true },
        ],
      },
    ],
  },
  /*****************************************************************************
   * DELETE OUTPUT
   ****************************************************************************/
  {
    type: STRUCTURE_TYPE.OUTPUT,
    operationSubType: OPERATION_SUB_TYPE.DELETE_ONE,
    expectedName: "delete-person-output",
    attributeTypes: [
      {
        publicAttributes: [
          { id: true },
          { type: true },
          { version: true },
          { "created-at": true },
          { "updated-at": true },
          { "deleted-at": false },
          { "my-name": true },
          { "first-name": true },
          { "last-name": false },
        ],
      },
      {
        itemAttributes: [],
      },
      { keyAttributes: [] },
      {
        generatedAttributes: [],
      },
    ],
  },
  /*****************************************************************************
   * LIST INPUT
   ****************************************************************************/
  {
    type: STRUCTURE_TYPE.INPUT,
    operationSubType: OPERATION_SUB_TYPE.LIST,
    expectedName: "list-people-input",
    attributeTypes: [
      {
        publicAttributes: [{ "lookup-text": true }],
      },
      {
        itemAttributes: [],
      },
      { keyAttributes: [{ pk: true }, { sk: true }] },
      {
        generatedAttributes: [{ type: true }, { version: true }, { sk: true }],
      },
    ],
  },
  /*****************************************************************************
   * LIST OUTPUT
   ****************************************************************************/
  {
    type: STRUCTURE_TYPE.OUTPUT,
    operationSubType: OPERATION_SUB_TYPE.LIST,
    expectedName: "list-people-output",
    attributeTypes: [
      {
        publicAttributes: [
          { id: true },
          { type: true },
          { version: true },
          { "created-at": true },
          { "updated-at": true },
          { "my-name": true },
          { "first-name": true },
          { "last-name": false },
        ],
      },
      {
        itemAttributes: [],
      },
      { keyAttributes: [] },
      {
        generatedAttributes: [],
      },
    ],
  },
];

describe("Parent", () => {
  test("Smoke test", () => {
    expect(fixture).toBeTruthy();
  });

  /*****************************************************************************
   * RESOURCE LEVEL
   ****************************************************************************/

  describe("Resource", () => {
    // only one service, one resource
    const resourceFixture = fixture.services[0].resources[0];

    /***************************************************************************
     * STRUCTURE LEVEL
     **************************************************************************/

    expectedStructures.forEach((expectedStructure) => {
      console.log("Expected", expectedStructure);
      const structureFixture = resourceFixture.structures.find((s) => {
        console.log(s.type);
        console.log(s.operation?.operationSubType);
        return (
          s.type === expectedStructure.type &&
          (expectedStructure.operationSubType.length === 0 ||
            s.operation?.operationSubType ===
              expectedStructure.operationSubType)
        );
      });

      if (!structureFixture) {
        throw new Error(
          `Cannot test structure type "${expectedStructure.operationSubType}.${expectedStructure.type}". No fixture exists`
        );
      }

      describe(`${expectedStructure.operationSubType} ${expectedStructure.type} Structure`, () => {
        test("Correct default name", () => {
          expect(structureFixture.name).toBe(expectedStructure.expectedName);
        });

        /***********************************************************************
         * ATTRIBUTE TYPES
         **********************************************************************/

        expectedStructure.attributeTypes.forEach((attributeType) => {
          const [expectedAttributeType, expectedAttributes] = Object.entries(
            attributeType
          )[0] as [string, { [key: string]: boolean }[]];

          const fixtureAtributes =
            expectedAttributeType === "publicAttributes"
              ? structureFixture.publicAttributes
              : expectedAttributeType === "itemAttributes"
              ? structureFixture.itemAttributes
              : expectedAttributeType === "keyAttributes"
              ? structureFixture.keyAttributes
              : structureFixture.generatedAttributes;

          describe(`${expectedAttributeType}`, () => {
            test(`Correct attributes`, () => {
              const actualNames = fixtureAtributes.map((a) => a.name);
              const expectedNames = expectedAttributes.map(
                (a) => Object.keys(a)[0]
              );
              /*
              console.log(
                expectedStructure.operationSubType,
                expectedStructure.type,
                expectedAttributeType,
                actualNames,
                expectedNames
              );*/

              expect(actualNames).toEqual(expectedNames);
            });

            /*
            expectedAttributes.forEach(
              (expectedAttribute) => {
                const [expectedKey, expectedValue] =
                  Object.entries(expectedAttribute)[0];
                test(`${expectedStructure.expectedName}.${expectedKey}.isRequired" should be "${expectedValue}"`, () => {
                  const testAttribute = structureFixture.publicAttributes.find(
                    (a) => a.name === expectedKey
                  );
                  expect(testAttribute?.isRequired).toBe(expectedValue);
                });
              }
            );*/
          });
        });
      });
    });
  });

  /*
  describe("Transient Structure", () => {
    test("correct default name", () => {
      const structure = myTransientStructure();
      expect(structure.name).toBe("person-message");
    });
  });
  */

  /*******************************************************************************
   * CREATE
   ******************************************************************************/

  // expected return values in tests
  // operation.input-vs-output.private-vs-public
  const operationTests = [
    {
      operationType: OPERATION_TYPE.MUTATION,
      operationSubType: OPERATION_SUB_TYPE.CREATE_ONE,
      structures: [
        {
          type: STRUCTURE_TYPE.INPUT,
          expectedName: "create-person-input",
          publicAttributes: [
            { "my-name": true },
            { "first-name": true },
            { "last-name": false },
          ],
          itemAttributes: [],
          keyAttributes: [],
          generatedAttributes: [
            { id: true },
            { t: true },
            { v: true },
            { cd: true },
            { ud: true },
            { mn: true },
            { fn: true },
            { ln: false },
            { pk: true },
            { sk: true },
            { "lookup-text": true },
          ],
        },
        /*
      {
        type: STRUCTURE_TYPE.OUTPUT,
        expectedName: "create-person-output",
        publicAttributes: [
          {
            values: [
              { id: true },
              { t: true },
              { v: true },
              { cd: true },
              { ud: true },
              { dd: false },
              { mn: true },
              { fn: true },
              { ln: false },
              { pk: true },
              { sk: true },
              { "lookup-text": true },
            ],
          },
          {
            values: [
              { id: true },
              { type: true },
              { version: true },
              { "created-at": true },
              { "updated-at": true },
              { "deleted-at": false },
              { "my-name": true },
              { "first-name": true },
              { "last-name": false },
            ],
          },
        ],
      },
      */
      ],
    },
    /*
  {
    operationType: OPERATION_TYPE.QUERY,
    operationSubType: OPERATION_SUB_TYPE.READ_ONE,
    structures: [
      {
        type: STRUCTURE_TYPE.INPUT,
        expectedName: "get-person-input",
        publicAttributes: [
          {
            values: [
              { id: true },
              { t: true },
              { v: true },
              { pk: true },
              { sk: true },
              { "lookup-text": true },
            ],
          },
          {
            values: [{ id: true }],
          },
        ],
      },
      {
        type: STRUCTURE_TYPE.OUTPUT,
        expectedName: "get-person-output",
        publicAttributes: [
          {
            values: [
              { id: true },
              { t: true },
              { v: true },
              { cd: true },
              { ud: true },
              { dd: false },
              { mn: true },
              { fn: true },
              { ln: false },
              { pk: true },
              { sk: true },
              { "lookup-text": true },
            ],
          },
          {
            values: [
              { id: true },
              { type: true },
              { version: true },
              { "created-at": true },
              { "updated-at": true },
              { "deleted-at": false },
              { "my-name": true },
              { "first-name": true },
              { "last-name": false },
            ],
          },
        ],
      },
    ],
  },
  {
    operationType: OPERATION_TYPE.MUTATION,
    operationSubType: OPERATION_SUB_TYPE.UPDATE_ONE,
    structures: [
      {
        type: STRUCTURE_TYPE.INPUT,
        expectedName: "update-person-input",
        publicAttributes: [
          {
            values: [
              { id: true },
              { t: true },
              { v: true },
              { ud: true },
              { mn: true },
              { fn: true },
              { ln: false },
              { pk: true },
              { sk: true },
              { "lookup-text": true },
            ],
          },
          {
            values: [
              { id: true },
              { "my-name": true },
              { "first-name": true },
              { "last-name": false },
            ],
          },
        ],
      },
      {
        type: STRUCTURE_TYPE.OUTPUT,
        expectedName: "update-person-output",
        publicAttributes: [
          {
            values: [
              { id: true },
              { t: true },
              { v: true },
              { cd: true },
              { ud: true },
              { dd: false },
              { mn: true },
              { fn: true },
              { ln: false },
              { pk: true },
              { sk: true },
              { "lookup-text": true },
            ],
          },
          {
            values: [
              { id: true },
              { type: true },
              { version: true },
              { "created-at": true },
              { "updated-at": true },
              { "deleted-at": false },
              { "my-name": true },
              { "first-name": true },
              { "last-name": false },
            ],
          },
        ],
      },
    ],
  },
  {
    operationType: OPERATION_TYPE.MUTATION,
    operationSubType: OPERATION_SUB_TYPE.DELETE_ONE,
    structures: [
      {
        type: STRUCTURE_TYPE.INPUT,
        expectedName: "delete-person-input",
        publicAttributes: [
          {
            values: [
              { id: true },
              { t: true },
              { v: true },
              { ud: true },
              { dd: false },
              { pk: true },
              { sk: true },
            ],
          },
          {
            values: [{ id: true }],
          },
        ],
      },
      {
        type: STRUCTURE_TYPE.OUTPUT,
        expectedName: "delete-person-output",
        publicAttributes: [
          {
            values: [
              { id: true },
              { t: true },
              { v: true },
              { cd: true },
              { ud: true },
              { dd: false },
              { mn: true },
              { fn: true },
              { ln: false },
              { pk: true },
              { sk: true },
              { "lookup-text": true },
            ],
          },
          {
            values: [
              { id: true },
              { type: true },
              { version: true },
              { "created-at": true },
              { "updated-at": true },
              { "deleted-at": false },
              { "my-name": true },
              { "first-name": true },
              { "last-name": false },
            ],
          },
        ],
      },
    ],
  },
  {
    operationType: OPERATION_TYPE.MUTATION,
    operationSubType: OPERATION_SUB_TYPE.IMPORT_ONE,
    structures: [
      {
        type: STRUCTURE_TYPE.INPUT,
        expectedName: "import-person-input",
        publicAttributes: [
          {
            values: [
              { id: true },
              { t: true },
              { v: true },
              { cd: true },
              { ud: true },
              { mn: true },
              { fn: true },
              { ln: false },
              { pk: true },
              { sk: true },
              { "lookup-text": true },
            ],
          },
          {
            values: [
              { id: true },
              { "my-name": true },
              { "first-name": true },
              { "last-name": false },
            ],
          },
        ],
      },
      {
        type: STRUCTURE_TYPE.OUTPUT,
        expectedName: "import-person-output",
        publicAttributes: [
          {
            values: [
              { id: true },
              { t: true },
              { v: true },
              { cd: true },
              { ud: true },
              { dd: false },
              { mn: true },
              { fn: true },
              { ln: false },
              { pk: true },
              { sk: true },
              { "lookup-text": true },
            ],
          },
          {
            values: [
              { id: true },
              { type: true },
              { version: true },
              { "created-at": true },
              { "updated-at": true },
              { "deleted-at": false },
              { "my-name": true },
              { "first-name": true },
              { "last-name": false },
            ],
          },
        ],
      },
    ],
  },
  */
  ];

  /**
   * We do some crazy looping here but it'sd an easier way then hand crafting each test.
   */

  operationTests.forEach((operation) => {
    // OPERATION
    describe(`${operation.operationType}.${operation.operationSubType}`, () => {
      /*
      const myOperation = () => {
        return new Operation(myResource(), {
          operationType: operation.operationType,
          operationSubType: operation.operationSubType,
        });
      };
      */

      // STRUCTURES
      operation.structures.forEach((structure) => {
        describe(`${structure.type}`, () => {
          /*
          const myInputOrOutput = () => {
            return new Structure(myResource(), {
              type: structure.type,
              operation: myOperation(),
            });
          };

          test("correct default structure name", () => {
            expect(myInputOrOutput().name).toBe(structure.expectedName);
          });*/
          // ATTRIBUTES
          /*
        const expectedResult = structure.publicAttributes.map((e) => {
          return Object.keys(e)[0];
        });*/
          //const testStructure = myInputOrOutput();
          /*
        const testAttributes = testStructure.publicAttributes.map((e) => {
          return e.name;
        });
        */
          /*
        console.log(expectedResult);*/
          /*
        test(`attribute names`, () => {
          expect(testAttributes).toEqual(expectedResult);
        });
        */
          // REQUIRED TESTS
          /*
        attribute.values.forEach((item) => {
          const [key, value] = Object.entries(item)[0];
          test(`.${attribute.type}.${key}.isRequired" should be "${value}"`, () => {
            const testAttribute =
              attribute.type === STRUCTURE_ATTRIBUTE_TYPE.PRIVATE
                ? testStructure.getPrivateAttributeByName(key)
                : testStructure.getPublicAttributeByName(key);
            expect(testAttribute?.isRequired).toBe(value);
          });
        });
        */
        });
      });
    });
  });
});