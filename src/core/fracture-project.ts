import { NodePackageManager } from "projen/lib/javascript";
import {
  TypeScriptProject,
  TypeScriptProjectOptions,
} from "projen/lib/typescript";
import { deepMerge } from "projen/lib/util";
import { SetOptional } from "type-fest";
import { FracturePackage } from "./fracture-package";
import { PnpmWorkspace } from "../pnpm/pnpm-workspace";
import { TurboRepo } from "../turborepo/turbo-repo";

/**
 *
 * Top level options for a Fracture project.
 *
 */
export interface FractureProjectOptions extends TypeScriptProjectOptions {
  packageDir?: string;
  serviceDir?: string;
  siteDir?: string;
}

/**
 * The root of the entire application.
 */
export class FractureProject extends TypeScriptProject {
  // member components
  public fracturePackages: FracturePackage[] = [];
  private turborepo: TurboRepo;
  // all other options
  public readonly options: FractureProjectOptions;

  constructor(
    options: SetOptional<FractureProjectOptions, "defaultReleaseBranch">
  ) {
    const defaultOptions: Partial<FractureProjectOptions> = {
      defaultReleaseBranch: "main",
      packageDir: "packages",
      serviceDir: "services",
      siteDir: "sites",
    };

    const requiredOptions: Partial<FractureProjectOptions> = {
      packageManager: NodePackageManager.PNPM,
      pnpmVersion: "8",
      prettier: true,
      projenrcTs: true,
      deps: ["turbo"].concat(options.deps ?? []),
    };

    const mergedOptions = deepMerge([
      defaultOptions,
      options,
      requiredOptions,
    ]) as FractureProjectOptions;

    super(mergedOptions);
    this.options = mergedOptions;

    // configure workspace
    new PnpmWorkspace(this);

    // configure turborepo
    this.turborepo = new TurboRepo(this);
  }

  public get packageDir(): string {
    return this.options.packageDir!;
  }

  public get serviceDir(): string {
    return this.options.serviceDir!;
  }

  public get siteDir(): string {
    return this.options.siteDir!;
  }

  public get buildTask() {
    return TurboRepo.buildTask(this);
  }

  /**
   * Build the project.
   *
   * Call this when you've configured everything, prior to preSynthesize.
   *
   * @returns void
   */
  public build() {
    this.fracturePackages.forEach((p) => {
      p.build();
    });
    this.turborepo.build();
  }
}
