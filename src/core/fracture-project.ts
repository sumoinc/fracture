import { LoggerOptions } from "projen";
import { NodePackageManager } from "projen/lib/javascript";
import {
  TypeScriptProject,
  TypeScriptProjectOptions,
} from "projen/lib/typescript";
import { AuditStrategy } from "./audit-strategy";
import { NamingStrategy } from "./naming-strategy";

/**
 *
 * Top level options for a Fracture project.
 *
 */
export interface FractureProjectOptions extends TypeScriptProjectOptions {
  /**
   * Logging options
   * @default LogLevel.INFO
   */
  logging?: LoggerOptions;
  /**
   * Versioned.
   * @default true
   */
  isVersioned?: boolean;
  /**
   * The naming strategy to use for generated code.
   */
  namingStrategy?: NamingStrategy;
  /**
   * The audit strategy to use for generated code.
   */
  auditStrategy?: AuditStrategy;
}

/**
 * The root of the entire application.
 */
export class FractureProject extends TypeScriptProject {
  // member components
  // project and namespace

  constructor(options: FractureProjectOptions) {
    const defaultOptions: Partial<FractureProjectOptions> = {};

    const requiredOptions: Partial<FractureProjectOptions> = {
      packageManager: NodePackageManager.PNPM,
      pnpmVersion: "8",
      prettier: true,
    };

    const mergedOptions = {
      ...defaultOptions,
      ...options,
      ...requiredOptions,
    };

    super(mergedOptions);
  }
}
