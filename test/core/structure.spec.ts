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

describe("Data Structure", () => {
  test("correct default name", () => {
    const structure = myDataStructure();
    expect(structure.name).toBe("person");
  });

  test("contains the correct private attributes", () => {
    const structure = myDataStructure();
    expect(structure.privateAttributeNames).toEqual([
      "pk",
      "sk",
      "id",
      "t",
      "v",
      "cd",
      "ud",
      "dd",
      "mn",
    ]);
  });

  test("contains the correct public attributes", () => {
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

describe("Create Structures", () => {
  const myCreateOperation = () => {
    return new Operation(myResource(), {
      operationType: OPERATION_TYPE.MUTATION,
      operationSubType: OPERATION_SUB_TYPE.CREATE_ONE,
    });
  };

  /*****************************************************************************
   * INPUT
   ****************************************************************************/

  describe("Input Structure", () => {
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

    test("contains the correct private attributes", () => {
      const structure = myCreateInput();
      expect(structure.privateAttributeNames).toEqual([
        "pk",
        "sk",
        "id",
        "t",
        "v",
        "cd",
        "ud",
        "mn",
      ]);
    });

    test("contains the correct public attributes", () => {
      const structure = myCreateInput();
      expect(structure.publicAttributeNames).toEqual(["my-name"]);
    });
  });

  /*****************************************************************************
   * OUTPUT
   ****************************************************************************/

  describe("Output Structure", () => {
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

    test("contains the correct private attributes", () => {
      const structure = myCreateOutput();
      expect(structure.privateAttributeNames).toEqual([
        "pk",
        "sk",
        "id",
        "t",
        "v",
        "cd",
        "ud",
        "mn",
      ]);
    });

    test("contains the correct public attributes", () => {
      const structure = myCreateOutput();
      expect(structure.publicAttributeNames).toEqual([
        "id",
        "type",
        "version",
        "created-at",
        "updated-at",
        "my-name",
      ]);
    });
  });
});

/*******************************************************************************
 * READ
 ******************************************************************************/

describe("Read Structures", () => {
  const myReadOperation = () => {
    return new Operation(myResource(), {
      operationType: OPERATION_TYPE.MUTATION,
      operationSubType: OPERATION_SUB_TYPE.READ_ONE,
    });
  };

  describe("Input Structure", () => {
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
  });

  describe("Output Structure", () => {
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
  });
});

/*******************************************************************************
 * UPDATE
 ******************************************************************************/

describe("Update Structures", () => {
  const myUpdateOperation = () => {
    return new Operation(myResource(), {
      operationType: OPERATION_TYPE.MUTATION,
      operationSubType: OPERATION_SUB_TYPE.UPDATE_ONE,
    });
  };

  describe("Input Structure", () => {
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
  });

  describe("Output Structure", () => {
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
  });
});

/*******************************************************************************
 * DELETE
 ******************************************************************************/

describe("Delete Structures", () => {
  const myDeleteOperation = () => {
    return new Operation(myResource(), {
      operationType: OPERATION_TYPE.MUTATION,
      operationSubType: OPERATION_SUB_TYPE.DELETE_ONE,
    });
  };

  describe("Input Structure", () => {
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
  });

  describe("Output Structure", () => {
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
  });
});

/*******************************************************************************
 * IMPORT
 ******************************************************************************/

describe("Import Structures", () => {
  const myImportOperation = () => {
    return new Operation(myResource(), {
      operationType: OPERATION_TYPE.MUTATION,
      operationSubType: OPERATION_SUB_TYPE.IMPORT_ONE,
    });
  };

  describe("Input Structure", () => {
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

  describe("Output Structure", () => {
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
