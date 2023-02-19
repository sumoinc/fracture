import { Fracture } from "../../src";
import { TestProject } from "../util";

test("Fracture will run", () => {
  const f = new Fracture(new TestProject());
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
    expect(f.outdir).toBe(f.project.outdir + "/fracture");
  });

  test("uses namespace", () => {
    const f = new Fracture(new TestProject(), "foo");
    expect(f.outdir).toBe(f.project.outdir + "/foo");
  });
});

describe("appsync", () => {
  test("true by default", () => {
    const f = new Fracture(new TestProject());
    expect(f.appsync).toBe(true);
  });

  test("can be disabled", () => {
    const f = new Fracture(new TestProject(), "foo", { appsync: false });
    expect(f.appsync).toBe(false);
  });
});

describe("apigateway", () => {
  test("true by default", () => {
    const f = new Fracture(new TestProject());
    expect(f.apigateway).toBe(true);
  });

  test("can be disabled", () => {
    const f = new Fracture(new TestProject(), "foo", { apigateway: false });
    expect(f.apigateway).toBe(false);
  });
});

describe("typescript", () => {
  test("true by default", () => {
    const f = new Fracture(new TestProject());
    expect(f.typescript).toBe(true);
  });

  test("can be disabled", () => {
    const f = new Fracture(new TestProject(), "foo", { typescript: false });
    expect(f.typescript).toBe(false);
  });
});
