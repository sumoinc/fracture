import {
  TypeScriptProject,
  TypeScriptProjectOptions,
} from "projen/lib/typescript";
import { TurboRepo } from "../turborepo";

export class Site extends TypeScriptProject {
  constructor(parent: TypeScriptProject, options: TypeScriptProjectOptions) {
    super({
      ...options,
    });

    // make sure sites is configured as a workspace
    TurboRepo.of(parent).addWorkspaceRoot("sites");
  }
}
