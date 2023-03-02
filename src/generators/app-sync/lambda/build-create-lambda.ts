import { formatStringByNamingStrategy } from "../../../core/naming-strategy";
import { Resource } from "../../../core/resource";
import { buildCommandNames } from "../../ts/command/build-command-names";
import { TypeScriptSource } from "../../ts/typescript-source";

export const buildCreateLambda = (resource: Resource) => {
  const names = buildCommandNames(resource);

  const f = new TypeScriptSource(
    resource.service,
    `app-sync/lambda/${names.create.file}/handler.ts`
  );

  const resourceFileName = formatStringByNamingStrategy(
    resource.name,
    resource.fracture.namingStrategy.ts.file
  );

  f.line('import { AppSyncResolverEvent } from "aws-lambda";');
  f.line(
    `import { ${names.create.input}, ${names.create.output} } from "../../../resources/${resourceFileName}";`
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
