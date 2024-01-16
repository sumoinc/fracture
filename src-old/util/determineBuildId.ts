import { execSync } from "child_process";

/**
 * Returns the current git branch name, without folder.
 *
 * ie: feature/1234 returns 1234
 *
 * @returns {string}
 */
export const determineBuildId = () => {
  const branchName = execSync("git rev-parse --abbrev-ref HEAD")
    .toString("utf8")
    .replace(/[\n\r\s]+$/, "");
  const branchPath = branchName.split("/");
  return branchPath[branchPath.length - 1];
};
