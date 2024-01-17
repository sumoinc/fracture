import { execSync } from "child_process";
import { Component } from "projen";
import { TypeScriptProject } from "projen/lib/typescript";

export interface RepositoryOptions {
  readonly repository: string;
}

export class Repository extends Component {
  public static of(project: TypeScriptProject): Repository | undefined {
    return project.node.children.find(
      (c) => c instanceof Repository
    ) as Repository;
  }

  public readonly url: string;
  public readonly org: string;
  public readonly name: string;
  public readonly branchFull: string;
  public readonly branchName: string;

  constructor(
    public readonly project: TypeScriptProject,
    options: RepositoryOptions
  ) {
    super(project);

    // validate that it's a URL
    try {
      new URL(options.repository);
    } catch (_) {
      throw new Error(
        `Repository URL is not a valid URL: ${options.repository}`
      );
    }

    // set props
    this.url = options.repository;
    this.org = options.repository.split("/").slice(-2, -1)[0] ?? "";
    this.name = options.repository.split("/").pop() ?? "";
    this.branchFull = findGitBranchFull();
    this.branchName = findGitBranchName();
  }
}

/**
 * Returns the current git branch name, with path.
 *
 * ie: feature/1234 returns feature/1234
 *
 */
export const findGitBranchFull = (): string => {
  const branchName = execSync("git rev-parse --abbrev-ref HEAD")
    .toString("utf8")
    .replace(/[\n\r\s]+$/, "");
  return branchName;
};

/**
 * Returns the current git branch name, without path.
 *
 * ie: feature/1234 returns 1234
 *
 */
export const findGitBranchName = (): string => {
  const branchPath = findGitBranchFull().split("/");
  return branchPath[branchPath.length - 1];
};
