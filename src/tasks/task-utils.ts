import { Task, TaskOptions } from "projen";
import { TypeScriptProject } from "projen/lib/typescript";

/**
 * Returns existing task if it exists or creates it if it doesn't.
 */
export const findOrCreateTask = (
  project: TypeScriptProject,
  name: string,
  options?: TaskOptions
): Task => {
  return (
    project.tasks.tryFind(name) ??
    project.addTask(name, {
      ...options,
    })
  );
};

/**
 * Condition that ensures task only runs locally.
 */
export const localOnlyTaskCondition = {
  condition: '[ ! -n "$CI" ]',
};

/**
 * Condition that ensures task only runs in CI.
 */
export const ciOnlyTaskCondition = {
  condition: '[ -n "$CI" ]',
};
