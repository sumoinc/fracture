import { Fracture } from "../../src";
import {
  AuditStrategy,
  defaultAuditStrategy,
} from "../../src/core/audit-strategy";
import {
  defaultNamingStrategy,
  NamingStrategy,
  NAMING_STRATEGY_TYPE,
} from "../../src/core/naming-strategy";
import {
  defaultPartitionKeyStrategy,
  PartitionKeyStrategy,
} from "../../src/core/partition-key-strategy";
import {
  ResourceAttributeGenerator,
  ResourceAttributeType,
} from "../../src/core/resource-attribute";
import {
  defaultTypeStrategy,
  TypeStrategy,
} from "../../src/core/type-strategy";
import {
  defaultVersionStrategy,
  VersionStrategy,
} from "../../src/core/version-strategy";
import { TestProject } from "../util";

test("Fracture will run", () => {
  const f = new Fracture(new TestProject());
  f.build();
  expect(f).toBeTruthy();
});

describe("projen project", () => {
  test("project stored", () => {
    const f = new Fracture(new TestProject());
    expect(f.project).toBeTruthy();
  });
});

describe("namespace", () => {
  test("default namespace", () => {
    const f = new Fracture(new TestProject());
    expect(f.namespace).toBe("fracture");
  });

  test("explicit namespace", () => {
    const f = new Fracture(new TestProject(), "foo");
    expect(f.namespace).toBe("foo");
  });

  test("two isolated namespaces", () => {
    const f1 = new Fracture(new TestProject(), "foo");
    const f2 = new Fracture(new TestProject(), "bar");
    expect(f1.namespace).toBe("foo");
    expect(f2.namespace).toBe("bar");
  });
});

describe("outdir", () => {
  test("matches project out by default", () => {
    const f = new Fracture(new TestProject());
    expect(f.outdir).toBe("fracture");
  });

  test("uses namespace as outdir", () => {
    const f = new Fracture(new TestProject(), "foo");
    expect(f.outdir).toBe("foo");
  });

  test("uses specific outdir", () => {
    const f = new Fracture(new TestProject(), "foo", { outdir: "baz" });
    expect(f.outdir).toBe("baz");
  });
});

describe("namingStrategy", () => {
  test("uses default", () => {
    const f = new Fracture(new TestProject());
    expect(f.namingStrategy).toEqual(defaultNamingStrategy);
  });
  test("naming strategy can be adjusted", () => {
    const fix: NamingStrategy = {
      ...defaultNamingStrategy,
      model: {
        interfaceName: NAMING_STRATEGY_TYPE.SNAKE_CASE,
        attributeName: NAMING_STRATEGY_TYPE.SNAKE_CASE,
      },
    };
    const f = new Fracture(new TestProject(), "foo", {
      namingStrategy: fix,
    });
    expect(f.namingStrategy).not.toEqual(defaultNamingStrategy);
    expect(f.namingStrategy).toEqual(fix);
  });
});

describe("partitionKeyStrategy", () => {
  test("uses default", () => {
    const f = new Fracture(new TestProject());
    expect(f.partitionKeyStrategy).toEqual(defaultPartitionKeyStrategy);
  });
  test("naming strategy can be adjusted", () => {
    const fix: PartitionKeyStrategy = {
      name: "nothing",
      comment: [`A crazy strategy.`],
      type: ResourceAttributeType.STRING,
      isRequired: true,
    };
    const f = new Fracture(new TestProject(), "foo", {
      partitionKeyStrategy: fix,
    });
    expect(f.partitionKeyStrategy).not.toEqual(defaultPartitionKeyStrategy);
    expect(f.partitionKeyStrategy).toEqual(fix);
  });
});

describe("version", () => {
  test("true by default", () => {
    const f = new Fracture(new TestProject());
    expect(f.versioned).toBe(true);
  });
  test("versioning can be turned off", () => {
    const f = new Fracture(new TestProject(), "foo", { versioned: false });
    expect(f.versioned).toBe(false);
  });
});

describe("versionStrategy", () => {
  test("uses default", () => {
    const f = new Fracture(new TestProject());
    expect(f.versionStrategy).toEqual(defaultVersionStrategy);
  });
  test("naming strategy can be adjusted", () => {
    const fix: VersionStrategy = {
      ...defaultVersionStrategy,
      currentVersion: "DOH",
    };
    const f = new Fracture(new TestProject(), "foo", {
      versionStrategy: fix,
    });
    expect(f.versionStrategy).not.toEqual(defaultVersionStrategy);
    expect(f.versionStrategy).toEqual(fix);
  });
});

describe("typeStrategy", () => {
  test("uses default", () => {
    const f = new Fracture(new TestProject());
    expect(f.typeStrategy).toEqual(defaultTypeStrategy);
  });
  test("naming strategy can be adjusted", () => {
    const fix: TypeStrategy = {
      ...defaultTypeStrategy,
      name: "fancy-type",
    };
    const f = new Fracture(new TestProject(), "foo", {
      typeStrategy: fix,
    });
    expect(f.typeStrategy).not.toEqual(defaultTypeStrategy);
    expect(f.typeStrategy).toEqual(fix);
  });
});

describe("auditStrategy", () => {
  test("uses default", () => {
    const f = new Fracture(new TestProject());
    expect(f.auditStrategy).toEqual(defaultAuditStrategy);
  });
  test("naming strategy can be adjusted", () => {
    const fix: AuditStrategy = {
      ...defaultAuditStrategy,
      create: {
        dateAttribute: {
          name: "created-one-day",
          shortName: "cd",
          comment: [`The date and time this record was created.`],
          type: ResourceAttributeType.DATE_TIME,
          createGenerator: ResourceAttributeGenerator.CURRENT_DATE_TIME_STAMP,
        },
      },
    };
    const f = new Fracture(new TestProject(), "foo", {
      auditStrategy: fix,
    });
    expect(f.auditStrategy).not.toEqual(defaultAuditStrategy);
    expect(f.auditStrategy).toEqual(fix);
  });
});

test("Can add services", () => {
  const f = new Fracture(new TestProject());
  expect(f.services.length).toBe(0);
  f.addService({ name: "foo" });
  expect(f.services.length).toBe(1);
});

test("Can add organization", () => {
  const f = new Fracture(new TestProject());
  expect(f.organizations.length).toBe(0);
  f.addOrganization({ orgId: "aaaaaaaa" });
  expect(f.organizations.length).toBe(1);
});
