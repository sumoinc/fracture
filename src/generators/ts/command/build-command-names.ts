import { formatStringByNamingStrategy } from "../../../core/naming-strategy";
import { Resource } from "../../../core/resource";

export const buildCommandNames = (resource: Resource) => {
  // we'll use this build the names of the commands
  const { commands, crud } = resource.fracture.namingStrategy.operations;
  const { model } = resource.fracture.namingStrategy;
  const { file } = resource.fracture.namingStrategy.ts;

  // output command names
  return {
    create: {
      file: formatStringByNamingStrategy(
        `${commands.commandPrefix}-${crud.createName}-${resource.name}-${commands.commandSuffix}`,
        file
      ),
      command: formatStringByNamingStrategy(
        `${commands.commandPrefix}-${crud.createName}-${resource.name}-${commands.commandSuffix}`,
        model.shapeName
      ),
      input: formatStringByNamingStrategy(
        `${commands.inputPrefix}-${crud.createName}-${resource.name}-${commands.inputSuffix}`,
        model.shapeName
      ),
      output: formatStringByNamingStrategy(
        `${commands.outputPrefix}-${crud.createName}-${resource.name}-${commands.outputSuffix}`,
        model.shapeName
      ),
    },
    read: {
      command: formatStringByNamingStrategy(
        `${commands.commandPrefix}-${crud.readName}-${resource.name}-${commands.commandSuffix}`,
        model.shapeName
      ),
      input: formatStringByNamingStrategy(
        `${commands.inputPrefix}-${crud.readName}-${resource.name}-${commands.inputSuffix}`,
        model.shapeName
      ),
      output: formatStringByNamingStrategy(
        `${commands.outputPrefix}-${crud.readName}-${resource.name}-${commands.outputSuffix}`,
        model.shapeName
      ),
    },
    update: {
      command: formatStringByNamingStrategy(
        `${commands.commandPrefix}-${crud.updateName}-${resource.name}-${commands.commandSuffix}`,
        model.shapeName
      ),
      input: formatStringByNamingStrategy(
        `${commands.inputPrefix}-${crud.updateName}-${resource.name}-${commands.inputSuffix}`,
        model.shapeName
      ),
      output: formatStringByNamingStrategy(
        `${commands.outputPrefix}-${crud.updateName}-${resource.name}-${commands.outputSuffix}`,
        model.shapeName
      ),
    },
    delete: {
      command: formatStringByNamingStrategy(
        `${commands.commandPrefix}-${crud.deleteName}-${resource.name}-${commands.commandSuffix}`,
        model.shapeName
      ),
      input: formatStringByNamingStrategy(
        `${commands.inputPrefix}-${crud.deleteName}-${resource.name}-${commands.inputSuffix}`,
        model.shapeName
      ),
      output: formatStringByNamingStrategy(
        `${commands.outputPrefix}-${crud.deleteName}-${resource.name}-${commands.outputSuffix}`,
        model.shapeName
      ),
    },
  };
};
