import {
  Operation,
  OPERATION_SUB_TYPE,
  OPERATION_TYPE,
} from "../../src/core/operation";
import { Resource } from "../../src/core/resource";
import { ResourceAttribute } from "../../src/core/resource-attribute";
import { Service } from "../../src/core/service";
import { Structure, STRUCTURE_TYPE } from "../../src/core/structure";
import { STRUCTURE_ATTRIBUTE_TYPE } from "../../src/core/structure-attribute";
import { TestFracture } from "../util";

const myService = () => {
  return new Service(new TestFracture(), { name: "tenant" });
};

const myResource = () => {
  const resource = new Resource(myService(), { name: "person" });
  new ResourceAttribute(resource, {
    name: "my-name",
    shortName: "mn",
    isRequired: true,
  });
  new ResourceAttribute(resource, {
    name: "first-name",
    shortName: "fn",
    isRequired: true,
    isLookupComponent: true,
  });
  new ResourceAttribute(resource, {
    name: "last-name",
    shortName: "ln",
    isLookupComponent: true,
  });
  return resource;
};

const myDataStructure = () => {
  return new Structure(myResource(), { type: STRUCTURE_TYPE.DATA });
};

const myTransientStructure = () => {
  return new Structure(myResource(), { type: STRUCTURE_TYPE.TRANSIENT });
};

test("Smoke test", () => {
  const structure = myDataStructure();
  expect(structure).toBeTruthy();
});

/*******************************************************************************
 * DATA STRUCTURE
 ******************************************************************************/

describe("Data Structure", () => {
  test("correct default name", () => {
    const structure = myDataStructure();
    expect(structure.name).toBe("person");
  });

  test("attributes:PRIVATE", () => {
    const structure = myDataStructure();
    expect(structure.privateAttributeNames).toEqual([
      "id",
      "t",
      "v",
      "cd",
      "ud",
      "dd",
      "mn",
      "fn",
      "ln",
      "pk",
      "sk",
      "idx",
    ]);
  });

  test("attributes.PUBLIC", () => {
    const structure = myDataStructure();
    expect(structure.publicAttributeNames).toEqual([
      "id",
      "type",
      "version",
      "created-at",
      "updated-at",
      "deleted-at",
      "my-name",
      "first-name",
      "last-name",
    ]);
  });
});

describe("Transient Structure", () => {
  test("correct default name", () => {
    const structure = myTransientStructure();
    expect(structure.name).toBe("person-message");
  });
});

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
        attributes: [
          {
            type: STRUCTURE_ATTRIBUTE_TYPE.PRIVATE,
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
              { idx: true },
            ],
          },
          {
            type: STRUCTURE_ATTRIBUTE_TYPE.PUBLIC,
            values: [
              { "my-name": true },
              { "first-name": true },
              { "last-name": false },
            ],
          },
        ],
      },
      {
        type: STRUCTURE_TYPE.OUTPUT,
        expectedName: "create-person-output",
        attributes: [
          {
            type: STRUCTURE_ATTRIBUTE_TYPE.PRIVATE,
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
              { idx: true },
            ],
          },
          {
            type: STRUCTURE_ATTRIBUTE_TYPE.PUBLIC,
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
    operationType: OPERATION_TYPE.QUERY,
    operationSubType: OPERATION_SUB_TYPE.READ_ONE,
    structures: [
      {
        type: STRUCTURE_TYPE.INPUT,
        expectedName: "get-person-input",
        attributes: [
          {
            type: STRUCTURE_ATTRIBUTE_TYPE.PRIVATE,
            values: [
              { id: true },
              { t: true },
              { v: true },
              { pk: true },
              { sk: true },
              { idx: true },
            ],
          },
          {
            type: STRUCTURE_ATTRIBUTE_TYPE.PUBLIC,
            values: [{ id: true }],
          },
        ],
      },
      {
        type: STRUCTURE_TYPE.OUTPUT,
        expectedName: "get-person-output",
        attributes: [
          {
            type: STRUCTURE_ATTRIBUTE_TYPE.PRIVATE,
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
              { idx: true },
            ],
          },
          {
            type: STRUCTURE_ATTRIBUTE_TYPE.PUBLIC,
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
        attributes: [
          {
            type: STRUCTURE_ATTRIBUTE_TYPE.PRIVATE,
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
              { idx: true },
            ],
          },
          {
            type: STRUCTURE_ATTRIBUTE_TYPE.PUBLIC,
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
        attributes: [
          {
            type: STRUCTURE_ATTRIBUTE_TYPE.PRIVATE,
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
              { idx: true },
            ],
          },
          {
            type: STRUCTURE_ATTRIBUTE_TYPE.PUBLIC,
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
        attributes: [
          {
            type: STRUCTURE_ATTRIBUTE_TYPE.PRIVATE,
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
            type: STRUCTURE_ATTRIBUTE_TYPE.PUBLIC,
            values: [{ id: true }],
          },
        ],
      },
      {
        type: STRUCTURE_TYPE.OUTPUT,
        expectedName: "delete-person-output",
        attributes: [
          {
            type: STRUCTURE_ATTRIBUTE_TYPE.PRIVATE,
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
              { idx: true },
            ],
          },
          {
            type: STRUCTURE_ATTRIBUTE_TYPE.PUBLIC,
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
        attributes: [
          {
            type: STRUCTURE_ATTRIBUTE_TYPE.PRIVATE,
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
              { idx: true },
            ],
          },
          {
            type: STRUCTURE_ATTRIBUTE_TYPE.PUBLIC,
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
        attributes: [
          {
            type: STRUCTURE_ATTRIBUTE_TYPE.PRIVATE,
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
              { idx: true },
            ],
          },
          {
            type: STRUCTURE_ATTRIBUTE_TYPE.PUBLIC,
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
];

/**
 * We do some crazy looping here but it'sd an easier way then hand crafting each test.
 */

operationTests.forEach((operation) => {
  // OPERATION
  describe(`${operation.operationType}.${operation.operationSubType}`, () => {
    const myOperation = () => {
      return new Operation(myResource(), {
        operationType: operation.operationType,
        operationSubType: operation.operationSubType,
      });
    };

    // STRUCTURES
    operation.structures.forEach((structure) => {
      describe(`${structure.type}`, () => {
        const myInputOrOutput = () => {
          return new Structure(myResource(), {
            type: structure.type,
            operation: myOperation(),
          });
        };

        test("correct default structure name", () => {
          expect(myInputOrOutput().name).toBe(structure.expectedName);
        });

        // ATTRIBUTES
        structure.attributes.forEach((attribute) => {
          // which attributes should we expect to see here?
          const expectedResult = attribute.values.map((e) => {
            return Object.keys(e)[0];
          });
          const testStructure = myInputOrOutput();

          test(`${attribute.type} attribute names`, () => {
            // private or public
            const testAttributes =
              attribute.type === STRUCTURE_ATTRIBUTE_TYPE.PRIVATE
                ? testStructure.privateAttributeNames
                : testStructure.publicAttributeNames;

            expect(testAttributes).toEqual(expectedResult);
          });

          // REQUIRED TESTS
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
        });
      });
    });
  });
});
