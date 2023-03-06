import { buildValidations } from "./build-validations";
import { setSytemResourceAttribute } from "./set-system-attribute";
import { formatStringByNamingStrategy } from "../../../core/naming-strategy";
import { Resource } from "../../../core/resource";
import { ResourceAttributeGenerator } from "../../../core/resource-attribute";
import { Service } from "../../../core/service";
import { VtlSource } from "../../vtl/vtl-source";

export const buildCreateRequest = (service: Service, e: Resource) => {
  const operationName = `${e.fracture.namingStrategy.operations.crud.createName}-${e.name}`;
  const fileName = formatStringByNamingStrategy(
    `mutation-${operationName}-request`,
    e.fracture.namingStrategy.appsync.vtl.file
  );

  const resolver = new VtlSource(service, `app-sync/vtl/${fileName}.vtl`);

  const shapeName = formatStringByNamingStrategy(
    e.name,
    e.fracture.namingStrategy.model.interfaceName
  );

  // validate imputs
  buildValidations(resolver, e);

  // initialise the shape + system values
  resolver.line(`## Initialise Resource`);
  resolver.open(`#set( $${shapeName} = {`);
  e.attributes
    .filter(
      (a) => a.isSystem && a.createGenerator !== ResourceAttributeGenerator.NONE
    )
    .forEach((a) => {
      resolver.line(setSytemResourceAttribute(a, a.createGenerator));
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
        `$util.quiet($${shapeName}.put("${a.shortName}", "$ctx.args.input.${attributeName}")`
      );

      resolver.close(`#end`);
      resolver.line("\n");
    });

  // assign keys
  // const ap = e.keyPattern;
  const gsi = service.dynamodb.keyGsi;
  resolver.line(`## KEYS`);
  resolver.line(
    `$util.quiet($${shapeName}.put("${
      gsi.pkName
    }", "$${shapeName}.${e.keyPattern.pk.map((k) => k.shortName).join("#")}"))`
  );
  resolver.line(
    `$util.quiet($${shapeName}.put("${gsi.skName}", "${e.keyPattern.sk
      .map((k) => "$" + shapeName + "." + k.shortName)
      .join("#")}"))`
  );
  resolver.line("\n");

  // dynamo command
  resolver.line(`## DYNAMODB PUT`);
  resolver.open(`{`);
  resolver.line(`"version" : "2018-05-29",`);
  resolver.line(`"operation" : "PutItem",`);
  resolver.open(`"key": {`);
  resolver.line(
    `"${gsi.pkName}": $util.dynamodb.toDynamoDBJson($${shapeName}.${gsi.pkName}),`
  );
  resolver.line(
    `"${gsi.skName}": $util.dynamodb.toDynamoDBJson($${shapeName}.${gsi.skName})`
  );
  resolver.close(`},`);
  resolver.line(`"attributeValues": $util.toJson($${shapeName})`);
  resolver.close(`}`);
  resolver.line("\n");
};
