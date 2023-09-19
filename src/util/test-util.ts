import { Project } from "projen";
import { synthSnapshot } from "projen/lib/util/synth";
import { App } from "../apps";
import { FractureProject } from "../fracture-project";
import {
  DataService,
  Operation,
  Resource,
  ResourceAttribute,
  ResourceAttributeType,
  Structure,
} from "../services";
import { NuxtJsSite, VitePressSite } from "../sites";

export const TEST_ACCOUNT_ONE = "000000000000";
export const TEST_ORG_ONE = "org-123456";
export const TEST_REGION_ONE = "us-east-1";

/**
 *
 * Helper to generate and return one file from fracture.
 * Useful when trying to test the final output of generated files.
 *
 * @param fracture
 * @param filepath
 * @returns collection of files starting with supplied filepath
 */
export const synthFiles = (project: Project, filepath: string = ""): any => {
  const snapshot = synthSnapshot(project);
  // console.log(Object.keys(snapshot));
  const filtered = Object.keys(snapshot)
    .filter((path) => path.startsWith(filepath))
    .reduce((obj, key) => {
      return {
        ...obj,
        [key]: snapshot[key],
      };
    }, {} as { [key: string]: any });
  return filtered;
};

export const synthFile = (project: Project, filepath: string): string => {
  const files = synthFiles(project, filepath);

  if (files.length > 1) {
    throw new Error(`more than one file matched filepath "${filepath}"`);
  }

  if (files.length === 0) {
    throw new Error(`No files matched filepath "${filepath}"`);
  }

  return files[filepath];
};

/**
 * Builds a simple data service as a test harness
 */
export const testFractureProject = () => {
  return new FractureProject({
    name: "my-project",
  });
};

/**
 * Builds a simple data service as a test harness
 */
export const testApp = () => {
  return new App({
    parent: testFractureProject(),
    name: "my-app",
  });
};

/**
 * Builds a simple data service as a test harness
 */
export const testDataService = () => {
  return new DataService({
    parent: testFractureProject(),
    name: "my-service",
  });
};

/**
 * Build a simple resource to test with
 */
export const testResource = () => {
  return new Resource(testDataService(), { name: "my-resource" });
};

/**
 * A more complicated resource configuration
 */
export const complexService = () => {
  const service = testDataService();

  const person = new Resource(service, { name: "person" });

  const club = new Resource(service, {
    name: "club",
    comments: ["A club"],
    attributeOptions: [{ name: "name" }],
  });

  person.addAttribute({
    name: "first-name",
    shortName: "fn",
  });
  person.addAttribute({
    name: "last-name",
    shortName: "ln",
  });
  person.addAttribute({
    name: "height",
    shortName: "ht",
    type: ResourceAttributeType.INT,
  });
  person.addAttribute({
    name: "is-frog",
    shortName: "if",
    type: ResourceAttributeType.BOOLEAN,
    comments: ["Is this person a frog?"],
  });
  person.addAttribute({
    name: "fav-colors",
    type: ResourceAttributeType.ARRAY,
    typeParameter: ResourceAttributeType.STRING,
    comments: ["List opf favorite colors"],
  });

  // one specific club
  person.addAttribute({
    name: "one-club",
    type: club,
  });
  // an array of clubs
  person.addAttribute({
    name: "array-of-clubs",
    shortName: "ad",
    type: ResourceAttributeType.ARRAY,
    typeParameter: club,
  });

  // operation
  Operation.create(person);
  //Operation.read(person);
  //Operation.update(person);
  //Operation.delete(person);

  return service;
};

/**
 * Build a simple resource attribute to test with
 */
export const testResourceAttribute = () => {
  const resource = testResource();
  return new ResourceAttribute(resource.service, {
    name: "my-attr",
    resource,
  });
};

/**
 * Build a simple structure to test with
 */
export const testStructure = () => {
  const service = testDataService();
  return new Structure(service, { name: "my-structure" });
};

/**
 * Build a simple operation to test with
 */
export const testOperation = () => {
  const resource = testResource();
  return new Operation(resource.service, { name: "my-operation", resource });
};

/**
 * Build a nuxt site to test with
 */
export const testNuxtJsSite = () => {
  return new NuxtJsSite({
    parent: testFractureProject(),
    name: "my-site",
  });
};

/**
 * Build a vitepress site to test with
 */
export const testVitePressSite = () => {
  return new VitePressSite({
    parent: testFractureProject(),
    name: "my-site",
  });
};
