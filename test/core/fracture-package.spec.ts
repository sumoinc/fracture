import { FracturePackage } from "../../src";
import { TestProject } from "../util";

test("Fracture will run", () => {
  const f = new FracturePackage(new TestProject());
  f.build();
  expect(f).toBeTruthy();
});

describe("projen project", () => {
  test("project stored", () => {
    const f = new FracturePackage(new TestProject());
    expect(f.project).toBeTruthy();
  });
});

describe("namespace", () => {
  test("default namespace", () => {
    const f = new FracturePackage(new TestProject());
    expect(f.namespace).toBe("fracture");
  });

  test("explicit namespace", () => {
    const f = new FracturePackage(new TestProject(), "foo");
    expect(f.namespace).toBe("foo");
  });

  test("two isolated namespaces", () => {
    const f1 = new FracturePackage(new TestProject(), "foo");
    const f2 = new FracturePackage(new TestProject(), "bar");
    expect(f1.namespace).toBe("foo");
    expect(f2.namespace).toBe("bar");
  });
});

/*
describe("outdir", () => {
  test("matches project out by default", () => {
    const f = new FracturePackage(new TestProject());
    expect(f.outdir).toBe("fracture");
  });

  test("uses namespace as outdir", () => {
    const f = new FracturePackage(new TestProject(), "foo");
    expect(f.outdir).toBe("foo");
  });
});
*/

test("Can add services", () => {
  const f = new FracturePackage(new TestProject());
  expect(f.services.length).toBe(0);
  f.addService({ name: "foo" });
  expect(f.services.length).toBe(1);
});

test("Can add organization", () => {
  const f = new FracturePackage(new TestProject());
  expect(f.organizations.length).toBe(0);
  f.addOrganization({ id: "aaaaaaaa" });
  expect(f.organizations.length).toBe(1);
});
