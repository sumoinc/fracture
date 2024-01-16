import { Project } from "projen";
import { synthSnapshot } from "projen/lib/util/synth";

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

// /**
//  * Builds a simple typescript app project as a test harness
//  */
// export const testProject = () => {
//   return new Project({
//     name: "my-project",
//   });
// };

// export const testNodeProject = (options: Partial<NodeProjectOptions> = {}) => {
//   return new NodeProject({
//     name: "my-project",
//     defaultReleaseBranch: "main",
//     packageManager: NodePackageManager.PNPM,
//     pnpmVersion: "8",
//     ...options,
//   });
// };

// /**
//  * Builds a simple typescript app project as a test harness
//  */
// export const testFractureProject = (
//   options: Partial<FractureProjectOptions> = {}
// ) => {
//   const fp = new FractureProject({
//     name: "my-project",
//     ...options,
//   });

//   /*
//   fp.buildEnvironment = new AwsEnvironment(fp, {
//     name: "test",
//     account: TEST_ACCOUNT_ONE,
//     region: TEST_REGION_ONE,
//     primaryHostedZoneId: "foo",
//     primaryDomainName: "bar",
//   });
//   */

//   return fp;
// };

// /**
//  * Builds a simple data service as a test harness
//  */
// export const testApp = () => {
//   return new App({
//     parent: testFractureProject(),
//     name: "my-app",
//   });
// };

// /**
//  * Builds a simple data service as a test harness
//  */
// export const testDataService = () => {
//   return new DataService(testApp(), {
//     name: "my-service",
//   });
// };

// /**
//  * Build a simple resource to test with
//  */
// export const testResource = () => {
//   const service = testDataService();
//   return new Resource(service.app, {
//     service,
//     name: "my-resource",
//   });
// };

// /**
//  * A more complicated resource configuration
//  */
// export const complexService = () => {
//   const service = testDataService();

//   const person = new Resource(service.app, { service, name: "person" });

//   const club = new Resource(service.app, {
//     service,
//     name: "club",
//     comments: ["A club"],
//     attributeOptions: [{ name: "name" }],
//   });

//   person.addAttribute({
//     name: "first-name",
//     shortName: "fn",
//   });
//   person.addAttribute({
//     name: "last-name",
//     shortName: "ln",
//   });
//   person.addAttribute({
//     name: "height",
//     shortName: "ht",
//     type: ResourceAttributeType.INT,
//   });
//   person.addAttribute({
//     name: "is-frog",
//     shortName: "if",
//     type: ResourceAttributeType.BOOLEAN,
//     comments: ["Is this person a frog?"],
//   });
//   person.addAttribute({
//     name: "fav-colors",
//     type: ResourceAttributeType.ARRAY,
//     typeParameter: ResourceAttributeType.STRING,
//     comments: ["List opf favorite colors"],
//   });

//   // one specific club
//   person.addAttribute({
//     name: "one-club",
//     type: club,
//   });
//   // an array of clubs
//   person.addAttribute({
//     name: "array-of-clubs",
//     shortName: "ad",
//     type: ResourceAttributeType.ARRAY,
//     typeParameter: club,
//   });

//   // an array of persons
//   club.addAttribute({
//     name: "array-of-persons",
//     type: ResourceAttributeType.ARRAY,
//     typeParameter: person,
//   });

//   // operation
//   Operation.create(person);
//   Operation.read(person);
//   Operation.update(person);
//   Operation.delete(person);

//   return service;
// };

// /**
//  * Build a simple resource attribute to test with
//  */
// export const testResourceAttribute = () => {
//   const service = testDataService();
//   const resource = testResource();
//   return new ResourceAttribute(service.app, {
//     name: "my-attr",
//     resource,
//   });
// };

// /**
//  * Build a simple structure to test with
//  */
// export const testStructure = () => {
//   const service = testDataService();
//   return new Structure(service.app, { name: "my-structure" });
// };

// /**
//  * Build a simple operation to test with
//  */
// export const testOperation = () => {
//   const resource = testResource();
//   return new Operation(resource.service.app, {
//     name: "my-operation",
//     resource,
//   });
// };

// /**
//  * Build a nuxt site to test with
//  */
// export const testNuxtJsSite = () => {
//   return new NuxtJsSite({
//     parent: testFractureProject(),
//     name: "my-site",
//   });
// };
// export const testServiceTwoRelatedResources = () => {
//   const service = testDataService();
//   const person = new Resource(service.app, {
//     service,
//     name: "person",
//     attributeOptions: [{ name: "name", shortName: "n" }],
//   });
//   const club = new Resource(service.app, {
//     service,
//     name: "club",
//     attributeOptions: [{ name: "name", shortName: "n" }],
//   });
//   club.addAttribute({
//     name: "people",
//     type: ResourceAttributeType.ARRAY,
//     typeParameter: person,
//   });
//   person.addAttribute({
//     name: "clubs",
//     type: ResourceAttributeType.ARRAY,
//     typeParameter: club,
//   });
//   return { service, person, club };
// };
