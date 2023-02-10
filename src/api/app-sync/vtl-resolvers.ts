import { SourceCode } from "projen";
import { ValueOf } from "type-fest";
import { FractureComponent } from "../../core/component";
import { Fracture } from "../../core/fracture";
import {
  Attribute,
  AttributeGenerator,
  Entity,
  ValidationRule,
} from "../../model";

export class VtlResolvers extends FractureComponent {
  constructor(fracture: Fracture) {
    super(fracture);
  }

  public preSynthesize() {
    // generate an array of all the entities in this fracture scope.
    const isEntity = (c: FractureComponent): c is Entity =>
      c instanceof Entity && c.namespace === this.namespace;
    const entities = (this.project.components as FractureComponent[]).filter(
      isEntity
    );

    /**
     *  Build a VTL file and make sure it's marked as being managed by projen.
     *
     * @param name
     * @returns {SourceCode]
     */
    const vtlFile = (name: string): SourceCode => {
      const f = new SourceCode(
        this.project,
        `${this.fracture.gendir}/api/app-sync/resolvers/vtl/${name}`
      );
      f.line("## " + f.marker);
      return f;
    };

    /**
     * Configures generated values for entity attributes.
     */
    const setSytemAttribute = (
      a: Attribute,
      g: ValueOf<typeof AttributeGenerator>
    ) => {
      switch (g) {
        case AttributeGenerator.CURRENT_DATE_TIME_STAMP:
          return `"${a.shortName}": "$util.time.nowISO8601()"`;
        case AttributeGenerator.GUID:
          return `"${a.shortName}": "$util.autoId()"`;
        case AttributeGenerator.TYPE:
          return `"${a.shortName}": "${a.entity.shortName}"`;
        default:
          throw new Error(`Unknown generator: ${g}`);
      }
    };

    const addValidations = (
      resolver: SourceCode,
      a: Attribute,
      rules: ValueOf<typeof ValidationRule>[]
    ) => {
      rules.forEach((rule) => {
        switch (rule) {
          case ValidationRule.REQUIRED:
            resolver.open(`#if( !$ctx.args.input.${a.shortName} )`);
            resolver.line(
              `$util.error("Input ${a.shortName} is required.", "InvalidParameter")`
            );
            resolver.close(`#end`);
            resolver.line("\n");
            break;

          default:
            break;
        }
      });
    };

    /**
     * Build create resolver for entity.
     */
    const createItemResolver = (e: Entity) => {
      // request header
      const requestResolver = vtlFile(`/Mutation.create-${e.name}.request.vtl`);
      requestResolver.line("\n");

      // validations
      requestResolver.line(`## VALIDATIONS`);
      e.attributes.forEach((a) => {
        addValidations(requestResolver, a, a.createValidations);
      });

      // setup system attributes
      requestResolver.line(`## CREATE SHAPE`);
      requestResolver.open(`#set( $${e.name} = {`);
      e.attributes
        .filter(
          (a) => a.isSystem && a.createGenerator !== AttributeGenerator.NONE
        )
        .forEach((a) => {
          requestResolver.line(setSytemAttribute(a, a.createGenerator));
        });
      requestResolver.close(`})`);
      requestResolver.line("\n");

      // add user inputs
      requestResolver.line(`## USER INPUTS`);
      e.attributes
        .filter((a) => !a.isSystem)
        .forEach((a) => {
          requestResolver.open(`#if( $ctx.args.input.${a.shortName} )`);
          requestResolver.line(
            `$util.quiet($${e.name}.put("${a.shortName}", "$ctx.args.input.${a.name}")`
          );
          requestResolver.close(`#end`);
          requestResolver.line("\n");
        });

      // dynamoDB putItem
      requestResolver.line(`## DYNAMODB PUT`);
      requestResolver.open(`{`);
      requestResolver.line(`"version" : "2018-05-29",`);
      requestResolver.line(`"operation" : "PutItem",`);
      requestResolver.open(`"key": {`);
      requestResolver.line(
        `"pk": $util.dynamodb.toDynamoDBJson($${e.name}.pk),`
      );
      requestResolver.line(
        `"sk": $util.dynamodb.toDynamoDBJson($${e.name}.sk)`
      );
      requestResolver.close(`},`);
      requestResolver.line(`"attributeValues": $util.toJson($${e.name})`);
      requestResolver.close(`}`);
      requestResolver.line("\n");

      // result resolver
      const responseResolver = vtlFile(
        `/Mutation.create-${e.name}.response.vtl`
      );
      responseResolver.line("$util.toJson($ctx.result)");
    };

    /**
     * Build read resolver for entity.
     */
    const readItemResolver = (e: Entity) => {
      const requestResolver = vtlFile(`/Query.read-${e.name}.request.vtl`);
      requestResolver.line("{}");
      const responseResolver = vtlFile(`/Query.read-${e.name}.response.vtl`);
      responseResolver.line("$util.toJson($ctx.result)");
    };

    /**
     * Build update resolver for entity.
     */
    const updateItemResolver = (e: Entity) => {
      const requestResolver = vtlFile(`/Mutation.update-${e.name}.request.vtl`);
      requestResolver.line("{}");
      const responseResolver = vtlFile(
        `/Mutation.update-${e.name}.response.vtl`
      );
      responseResolver.line("$util.toJson($ctx.result)");
    };

    /**
     * Build delete resolver for entity.
     */
    const deleteItemResolver = (e: Entity) => {
      const requestResolver = vtlFile(`/Mutation.delete-${e.name}.request.vtl`);
      requestResolver.line("{}");
      const responseResolver = vtlFile(
        `/Mutation.delete-${e.name}.response.vtl`
      );
      responseResolver.line("$util.toJson($ctx.result)");
    };

    entities.forEach((e) => {
      // build CRUD resolvers
      createItemResolver(e);
      readItemResolver(e);
      updateItemResolver(e);
      deleteItemResolver(e);
    });
  }
}
