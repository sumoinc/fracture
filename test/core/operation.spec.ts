test("placeholder", () => {
  expect(true).toBe(true);
});

/*
const myService = () => {
  return new Service(new TestFracture(), { name: "tenant" });
};

const myResource = () => {
  const resource = new Resource(myService(), { name: "person" });
  new ResourceAttribute(resource, { name: "my-name" });
  return resource;
};

const createOperation = () => {
  return new Operation(myResource(), {
    operationType: OPERATION_TYPE.MUTATION,
    operationSubType: OPERATION_SUB_TYPE.CREATE_ONE,
  });
};

const readOperation = () => {
  return new Operation(myResource(), {
    operationType: OPERATION_TYPE.MUTATION,
    operationSubType: OPERATION_SUB_TYPE.READ_ONE,
  });
};

const updateOperation = () => {
  return new Operation(myResource(), {
    operationType: OPERATION_TYPE.MUTATION,
    operationSubType: OPERATION_SUB_TYPE.UPDATE_ONE,
  });
};

const deleteOperation = () => {
  return new Operation(myResource(), {
    operationType: OPERATION_TYPE.MUTATION,
    operationSubType: OPERATION_SUB_TYPE.DELETE_ONE,
  });
};

const importOperation = () => {
  return new Operation(myResource(), {
    operationType: OPERATION_TYPE.MUTATION,
    operationSubType: OPERATION_SUB_TYPE.IMPORT_ONE,
  });
};
*/
/*
describe("Create Operation", () => {
  test("correct default name", () => {
    const operation = createOperation();
    expect(operation.name).toBe("create-person");
  });
});

describe("Read Operation", () => {
  test("correct default name", () => {
    const operation = readOperation();
    expect(operation.name).toBe("get-person");
  });
});

describe("Update Operation", () => {
  test("correct default name", () => {
    const operation = updateOperation();
    expect(operation.name).toBe("update-person");
  });
});

describe("Delete Operation", () => {
  test("correct default name", () => {
    const operation = deleteOperation();
    expect(operation.name).toBe("delete-person");
  });
});

describe("Import Operation", () => {
  test("correct default name", () => {
    const operation = importOperation();
    expect(operation.name).toBe("import-person");
  });
});
*/
