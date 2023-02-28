import { formatStringByNamingStrategy } from "../../../core/naming-strategy";
import { Shape } from "../../../model";

export const buildCommandNames = (shape: Shape) => {
  // we'll use this build the names of the commands
  const { commands, crud } = shape.fracture.namingStrategy.operations;
  const { model } = shape.fracture.namingStrategy;
  const { file } = shape.fracture.namingStrategy.ts;

  // output command names
  return {
    create: {
      file: formatStringByNamingStrategy(
        `${commands.commandPrefix}-${crud.createName}-${shape.name}-${commands.commandSuffix}`,
        file
      ),
      command: formatStringByNamingStrategy(
        `${commands.commandPrefix}-${crud.createName}-${shape.name}-${commands.commandSuffix}`,
        model.shapeName
      ),
      input: formatStringByNamingStrategy(
        `${commands.inputPrefix}-${crud.createName}-${shape.name}-${commands.inputSuffix}`,
        model.shapeName
      ),
      output: formatStringByNamingStrategy(
        `${commands.outputPrefix}-${crud.createName}-${shape.name}-${commands.outputSuffix}`,
        model.shapeName
      ),
    },
    read: {
      command: formatStringByNamingStrategy(
        `${commands.commandPrefix}-${crud.readName}-${shape.name}-${commands.commandSuffix}`,
        model.shapeName
      ),
      input: formatStringByNamingStrategy(
        `${commands.inputPrefix}-${crud.readName}-${shape.name}-${commands.inputSuffix}`,
        model.shapeName
      ),
      output: formatStringByNamingStrategy(
        `${commands.outputPrefix}-${crud.readName}-${shape.name}-${commands.outputSuffix}`,
        model.shapeName
      ),
    },
    update: {
      command: formatStringByNamingStrategy(
        `${commands.commandPrefix}-${crud.updateName}-${shape.name}-${commands.commandSuffix}`,
        model.shapeName
      ),
      input: formatStringByNamingStrategy(
        `${commands.inputPrefix}-${crud.updateName}-${shape.name}-${commands.inputSuffix}`,
        model.shapeName
      ),
      output: formatStringByNamingStrategy(
        `${commands.outputPrefix}-${crud.updateName}-${shape.name}-${commands.outputSuffix}`,
        model.shapeName
      ),
    },
    delete: {
      command: formatStringByNamingStrategy(
        `${commands.commandPrefix}-${crud.deleteName}-${shape.name}-${commands.commandSuffix}`,
        model.shapeName
      ),
      input: formatStringByNamingStrategy(
        `${commands.inputPrefix}-${crud.deleteName}-${shape.name}-${commands.inputSuffix}`,
        model.shapeName
      ),
      output: formatStringByNamingStrategy(
        `${commands.outputPrefix}-${crud.deleteName}-${shape.name}-${commands.outputSuffix}`,
        model.shapeName
      ),
    },
  };
};
