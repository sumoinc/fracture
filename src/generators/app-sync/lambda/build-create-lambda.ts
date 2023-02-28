import { formatStringByNamingStrategy } from "../../../core/naming-strategy";
import { Shape } from "../../../model";
import { buildCommandNames } from "../../ts/command/build-command-names";
import { TypeScriptSource } from "../../ts/typescript-source";

export const buildCreateLambda = (shape: Shape) => {
  const names = buildCommandNames(shape);

  const f = new TypeScriptSource(
    shape.service,
    `app-sync/lambda/${names.create.file}/handler.ts`
  );

  const shapeFileName = formatStringByNamingStrategy(
    shape.name,
    shape.fracture.namingStrategy.ts.file
  );

  f.line('import { AppSyncResolverEvent } from "aws-lambda";');
  f.line(
    `import { ${names.create.input}, ${names.create.output} } from "../../../shapes/${shapeFileName}";`
  );
  f.line("\n");

  // open function
  f.open("export const handler = async (");
  f.line(`event: AppSyncResolverEvent<${names.create.input}>`);
  f.close(`): Promise<${names.create.output}> => {`);
  f.open("");

  // return and close function
  f.line(`return { id: "foo" };`);
  f.close(`};`);
  f.line("\n");
};
