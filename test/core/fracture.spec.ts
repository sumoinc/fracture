import { Fracture } from "../../src";
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
    expect(f.options.outdir).toBe("fracture");
  });

  test("uses namespace as outdir", () => {
    const f = new Fracture(new TestProject(), "foo");
    expect(f.options.outdir).toBe("foo");
  });

  test("uses specific outdir", () => {
    const f = new Fracture(new TestProject(), "foo", { outdir: "baz" });
    expect(f.options.outdir).toBe("baz");
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
  f.addOrganization({ id: "aaaaaaaa" });
  expect(f.organizations.length).toBe(1);
});
