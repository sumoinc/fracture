import { formatStringByNamingStrategy } from "../../../core/naming-strategy";
import { Shape } from "../../../model";
import { TypeScriptSource } from "../typescript-source";

export const addCreateCommand = (e: Shape) => {
  const command = `${e.fracture.namingStrategy.operations.commands.commandPrefix}-${e.fracture.namingStrategy.operations.crud.createName}-${e.name}-${e.fracture.namingStrategy.operations.commands.commandSuffix}`;
  const commandInput = `${e.fracture.namingStrategy.operations.commands.inputPrefix}-${e.fracture.namingStrategy.operations.crud.createName}-${e.name}-${e.fracture.namingStrategy.operations.commands.inputSuffix}`;
  const commandOutput = `${e.fracture.namingStrategy.operations.commands.outputPrefix}-${e.fracture.namingStrategy.operations.crud.createName}-${e.name}-${e.fracture.namingStrategy.operations.commands.inputSuffix}`;

  const fileName = formatStringByNamingStrategy(
    command,
    e.fracture.namingStrategy.ts.file
  );
  const f = new TypeScriptSource(e.service, `/commands/${fileName}.ts`);

  const commandInputName = formatStringByNamingStrategy(
    commandInput,
    e.fracture.namingStrategy.model.shapeName
  );

  const commandOutputName = formatStringByNamingStrategy(
    commandOutput,
    e.fracture.namingStrategy.model.shapeName
  );

  f.open(`export interface ${commandInputName} {`);
  f.line("foo: string;");
  f.close(`}`);
  f.line("\n");

  f.open(`export interface ${commandOutputName} {`);
  f.line("foo: string;");
  f.close(`}`);
  f.line("\n");

  f.open(`export const handler = async (event: any) => {`);
  f.line("return true;");
  f.close(`};`);
  f.line("\n");
};
