import { addValidations } from "./add-validations";
import { setSytemAttribute } from "./set-system-attribute";
import { formatStringByNamingStrategy } from "../../../../core/naming-strategy";
import { AttributeGenerator, Entity } from "../../../../model";
import { VtlSource } from "../../../vtl/vtl-source";

export const addCreateRequest = (e: Entity) => {
  const operationName = `${e.fracture.namingStrategy.operations.crud.createName}-${e.name}`;
  const fileName = formatStringByNamingStrategy(
    `mutation-${operationName}-request`,
    e.fracture.namingStrategy.appsync.vtl.file
  );

  const resolver = new VtlSource(e.fracture, `app-sync/vtl/${fileName}.vtl`);

  const entityName = formatStringByNamingStrategy(
    e.name,
    e.fracture.namingStrategy.model.entityName
  );

  // validate imputs
  addValidations(resolver, e);

  // initialise the shape + system values
  resolver.line(`## Initialise Shape`);
  resolver.open(`#set( $${entityName} = {`);
  e.attributes
    .filter((a) => a.isSystem && a.createGenerator !== AttributeGenerator.NONE)
    .forEach((a) => {
      resolver.line(setSytemAttribute(a, a.createGenerator));
    });
  resolver.close(`})`);
  resolver.line("\n");

  // user input
  resolver.line(`## USER INPUTS`);
  e.attributes
    .filter((a) => !a.isSystem)
    .forEach((a) => {
      const attributeName = formatStringByNamingStrategy(
        a.name,
        a.fracture.namingStrategy.model.attributeName
      );
      resolver.open(`#if( $ctx.args.input.${attributeName} )`);
      resolver.line(
        `$util.quiet($${entityName}.put("${a.shortName}", "$ctx.args.input.${attributeName}")`
      );

      resolver.close(`#end`);
      resolver.line("\n");
    });

  resolver.line(`## DYNAMODB PUT`);
  resolver.open(`{`);
  resolver.line(`"version" : "2018-05-29",`);
  resolver.line(`"operation" : "PutItem",`);
  resolver.open(`"key": {`);
  resolver.line(`"pk": $util.dynamodb.toDynamoDBJson($${entityName}.pk),`);
  resolver.line(`"sk": $util.dynamodb.toDynamoDBJson($${entityName}.sk)`);
  resolver.close(`},`);
  resolver.line(`"attributeValues": $util.toJson($${entityName})`);
  resolver.close(`}`);
  resolver.line("\n");
};
