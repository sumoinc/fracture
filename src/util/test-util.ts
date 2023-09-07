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
export const synthFiles = (project: Project, filepath: string): any => {
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
