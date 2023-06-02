import { NodePackageManager } from "projen/lib/javascript";
import {
  TypeScriptProject,
  TypeScriptProjectOptions,
} from "projen/lib/typescript";
import { SetOptional } from "type-fest";

/**
 *
 * Top level options for a Fracture project.
 *
 */
export interface FractureProjectOptions extends TypeScriptProjectOptions {
  packageDir?: string;
}

/**
 * The root of the entire application.
 */
export class FractureProject extends TypeScriptProject {
  public readonly options: FractureProjectOptions;

  constructor(
    options: SetOptional<FractureProjectOptions, "defaultReleaseBranch">
  ) {
    const defaultOptions: Partial<FractureProjectOptions> = {
      defaultReleaseBranch: "main",
      packageDir: "packages",
    };

    const requiredOptions: Partial<FractureProjectOptions> = {
      packageManager: NodePackageManager.PNPM,
      pnpmVersion: "8",
      prettier: true,
      projenrcTs: true,
    };

    const mergedOptions = {
      ...defaultOptions,
      ...options,
      ...requiredOptions,
    } as FractureProjectOptions;

    super(mergedOptions);

    this.options = mergedOptions;
  }

  public get packageDir(): string {
    return this.options.packageDir!;
  }
}
