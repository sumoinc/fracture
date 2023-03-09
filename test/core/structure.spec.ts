import {
  Operation,
  OPERATION_SUB_TYPE,
  OPERATION_TYPE,
} from "../../src/core/operation";
import { Resource } from "../../src/core/resource";
import { ResourceAttribute } from "../../src/core/resource-attribute";
import { Service } from "../../src/core/service";
import { Structure, STRUCTURE_TYPE } from "../../src/core/structure";
import { TestFracture } from "../util";

const myService = () => {
  return new Service(new TestFracture(), { name: "tenant" });
};

const myResource = () => {
  const resource = new Resource(myService(), { name: "person" });
  new ResourceAttribute(resource, { name: "my-name", shortName: "mn" });
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
      "pk",
      "sk",
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

describe("operation.CREATE", () => {
  const myCreateOperation = () => {
    return new Operation(myResource(), {
      operationType: OPERATION_TYPE.MUTATION,
      operationSubType: OPERATION_SUB_TYPE.CREATE_ONE,
    });
  };

  /*****************************************************************************
   * INPUT
   ****************************************************************************/

  describe("structure.INPUT", () => {
    const myCreateInput = () => {
      return new Structure(myResource(), {
        type: STRUCTURE_TYPE.INPUT,
        operation: myCreateOperation(),
      });
    };

    test("correct default name", () => {
      const structure = myCreateInput();
      expect(structure.name).toBe("create-person-input");
    });

    test("attributes:PRIVATE", () => {
      const structure = myCreateInput();
      expect(structure.privateAttributeNames).toEqual([
        "id",
        "t",
        "v",
        "cd",
        "ud",
        "mn",
        "pk",
        "sk",
      ]);
    });

    test("attributes.PUBLIC", () => {
      const structure = myCreateInput();
      expect(structure.publicAttributeNames).toEqual(["my-name"]);
    });
  });

  /*****************************************************************************
   * OUTPUT
   ****************************************************************************/

  describe("structure.OUTPUT", () => {
    const myCreateOutput = () => {
      return new Structure(myResource(), {
        type: STRUCTURE_TYPE.OUTPUT,
        operation: myCreateOperation(),
      });
    };

    test("correct default name", () => {
      const structure = myCreateOutput();
      expect(structure.name).toBe("create-person-output");
    });

    test("attributes:PRIVATE", () => {
      const structure = myCreateOutput();
      expect(structure.privateAttributeNames).toEqual([
        "id",
        "t",
        "v",
        "cd",
        "ud",
        "dd",
        "mn",
        "pk",
        "sk",
      ]);
    });

    test("attributes.PUBLIC", () => {
      const structure = myCreateOutput();
      expect(structure.publicAttributeNames).toEqual([
        "id",
        "type",
        "version",
        "created-at",
        "updated-at",
        "deleted-at",
        "my-name",
      ]);
    });
  });
});

/*******************************************************************************
 * READ
 ******************************************************************************/

describe("operation.READ", () => {
  const myReadOperation = () => {
    return new Operation(myResource(), {
      operationType: OPERATION_TYPE.MUTATION,
      operationSubType: OPERATION_SUB_TYPE.READ_ONE,
    });
  };

  describe("structure.INPUT", () => {
    const myReadInput = () => {
      return new Structure(myResource(), {
        type: STRUCTURE_TYPE.INPUT,
        operation: myReadOperation(),
      });
    };

    test("correct default name", () => {
      const structure = myReadInput();
      expect(structure.name).toBe("get-person-input");
    });

    test("attributes:PRIVATE", () => {
      const structure = myReadInput();
      expect(structure.privateAttributeNames).toEqual([
        "id",
        "t",
        "v",
        "pk",
        "sk",
      ]);
    });

    test("attributes.PUBLIC", () => {
      const structure = myReadInput();
      expect(structure.publicAttributeNames).toEqual(["id"]);
    });
  });

  describe("structure.OUTPUT", () => {
    const myReadOutput = () => {
      return new Structure(myResource(), {
        type: STRUCTURE_TYPE.OUTPUT,
        operation: myReadOperation(),
      });
    };

    test("correct default name", () => {
      const structure = myReadOutput();
      expect(structure.name).toBe("get-person-output");
    });

    test("attributes:PRIVATE", () => {
      const structure = myReadOutput();
      expect(structure.privateAttributeNames).toEqual([
        "id",
        "t",
        "v",
        "cd",
        "ud",
        "dd",
        "mn",
        "pk",
        "sk",
      ]);
    });

    test("attributes.PUBLIC", () => {
      const structure = myReadOutput();
      expect(structure.publicAttributeNames).toEqual([
        "id",
        "type",
        "version",
        "created-at",
        "updated-at",
        "deleted-at",
        "my-name",
      ]);
    });
  });
});

/*******************************************************************************
 * UPDATE
 ******************************************************************************/

describe("operation.UPDATE", () => {
  const myUpdateOperation = () => {
    return new Operation(myResource(), {
      operationType: OPERATION_TYPE.MUTATION,
      operationSubType: OPERATION_SUB_TYPE.UPDATE_ONE,
    });
  };

  describe("structure.INPUT", () => {
    const myUpdateInput = () => {
      return new Structure(myResource(), {
        type: STRUCTURE_TYPE.INPUT,
        operation: myUpdateOperation(),
      });
    };

    test("correct default name", () => {
      const structure = myUpdateInput();
      expect(structure.name).toBe("update-person-input");
    });

    test("attributes:PRIVATE", () => {
      const structure = myUpdateInput();
      expect(structure.privateAttributeNames).toEqual([
        "id",
        "t",
        "v",
        "ud",
        "mn",
        "pk",
        "sk",
      ]);
    });

    test("attributes.PUBLIC", () => {
      const structure = myUpdateInput();
      expect(structure.publicAttributeNames).toEqual(["id", "my-name"]);
    });
  });

  describe("structure.OUTPUT", () => {
    const myUpdateOutput = () => {
      return new Structure(myResource(), {
        type: STRUCTURE_TYPE.OUTPUT,
        operation: myUpdateOperation(),
      });
    };

    test("correct default name", () => {
      const structure = myUpdateOutput();
      expect(structure.name).toBe("update-person-output");
    });

    test("attributes:PRIVATE", () => {
      const structure = myUpdateOutput();
      expect(structure.privateAttributeNames).toEqual([
        "id",
        "t",
        "v",
        "cd",
        "ud",
        "dd",
        "mn",
        "pk",
        "sk",
      ]);
    });

    test("attributes.PUBLIC", () => {
      const structure = myUpdateOutput();
      expect(structure.publicAttributeNames).toEqual([
        "id",
        "type",
        "version",
        "created-at",
        "updated-at",
        "deleted-at",
        "my-name",
      ]);
    });
  });
});

/*******************************************************************************
 * DELETE
 ******************************************************************************/

describe("operation.DELETE", () => {
  const myDeleteOperation = () => {
    return new Operation(myResource(), {
      operationType: OPERATION_TYPE.MUTATION,
      operationSubType: OPERATION_SUB_TYPE.DELETE_ONE,
    });
  };

  describe("structure.INPUT", () => {
    const myDeleteInput = () => {
      return new Structure(myResource(), {
        type: STRUCTURE_TYPE.INPUT,
        operation: myDeleteOperation(),
      });
    };

    test("correct default name", () => {
      const structure = myDeleteInput();
      expect(structure.name).toBe("delete-person-input");
    });

    test("attributes:PRIVATE", () => {
      const structure = myDeleteInput();
      expect(structure.privateAttributeNames).toEqual([
        "id",
        "t",
        "v",
        "ud",
        "dd",
        "pk",
        "sk",
      ]);
    });

    test("attributes.PUBLIC", () => {
      const structure = myDeleteInput();
      expect(structure.publicAttributeNames).toEqual(["id"]);
    });
  });

  describe("structure.OUTPUT", () => {
    const myDeleteOutput = () => {
      return new Structure(myResource(), {
        type: STRUCTURE_TYPE.OUTPUT,
        operation: myDeleteOperation(),
      });
    };

    test("correct default name", () => {
      const structure = myDeleteOutput();
      expect(structure.name).toBe("delete-person-output");
    });

    test("attributes:PRIVATE", () => {
      const structure = myDeleteOutput();
      expect(structure.privateAttributeNames).toEqual([
        "id",
        "t",
        "v",
        "cd",
        "ud",
        "dd",
        "mn",
        "pk",
        "sk",
      ]);
    });

    test("attributes.PUBLIC", () => {
      const structure = myDeleteOutput();
      expect(structure.publicAttributeNames).toEqual([
        "id",
        "type",
        "version",
        "created-at",
        "updated-at",
        "deleted-at",
        "my-name",
      ]);
    });
  });
});

/*******************************************************************************
 * IMPORT
 ******************************************************************************/

describe("operation.IMPORT", () => {
  const myImportOperation = () => {
    return new Operation(myResource(), {
      operationType: OPERATION_TYPE.MUTATION,
      operationSubType: OPERATION_SUB_TYPE.IMPORT_ONE,
    });
  };

  describe("structure.INPUT", () => {
    const myImportInput = () => {
      return new Structure(myResource(), {
        type: STRUCTURE_TYPE.INPUT,
        operation: myImportOperation(),
      });
    };

    test("correct default name", () => {
      const structure = myImportInput();
      expect(structure.name).toBe("import-person-input");
    });
  });

  describe("structure.OUTPUT", () => {
    const myImportOutput = () => {
      return new Structure(myResource(), {
        type: STRUCTURE_TYPE.OUTPUT,
        operation: myImportOperation(),
      });
    };

    test("correct default name", () => {
      const structure = myImportOutput();
      expect(structure.name).toBe("import-person-output");
    });
  });
});
