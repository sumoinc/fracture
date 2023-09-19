import { camelCase, pascalCase } from "change-case";
import { GraphQLInputObjectType, GraphQLList, GraphQLType } from "graphql";
import { Component } from "projen";
import { GraphQlSchemaField } from "./graphql-schema-field";
import { GraphQlSchemaIdInput } from "./graphql-schema-id-input";
import {
  DataService,
  ResourceAttributeType,
  Structure,
  VisabilityType,
} from "../../services";

export type GraphQlSchemaInputOptions = {
  name: string;
};

export class GraphQlSchemaInput extends Component {
  /**
   * Returns an attribute by name, or undefined if it doesn't exist
   */
  public static byName(
    service: DataService,
    name: string
  ): GraphQlSchemaInput | undefined {
    const isDefined = (c: Component): c is GraphQlSchemaInput =>
      c instanceof GraphQlSchemaInput && c.name === name;
    return service.components.find(isDefined);
  }

  /**
   * the name for this type
   */
  public readonly name: string;

  /**
   * the name for this type
   */
  public readonly typeName: string;

  /**
   * The type fopr this field
   */
  public typeDef: GraphQLType;

  constructor(
    public readonly project: DataService,
    options: GraphQlSchemaInputOptions
  ) {
    super(project);

    this.name = options.name;

    // get the origin resource this is mapped to
    const structure = Structure.byName(project, this.name);

    if (!structure) {
      throw new Error(`Could not find resource for attribute "${this.name}"`);
    }

    // GraphQl name for this type
    this.typeName = pascalCase(structure.name);

    // build fields
    const fields = structure.attributes
      .filter((a) => a.visibility === VisabilityType.USER_VISIBLE)
      .reduce((acc, a) => {
        // get the right value
        let theType =
          a.type === ResourceAttributeType.ARRAY ? a.typeParameter : a.type;

        // is if a base type?
        const isBaseType = !!Object.values(ResourceAttributeType).find((t) => {
          return t === theType;
        });

        const field = isBaseType
          ? GraphQlSchemaField.byName(project, a.name) ??
            new GraphQlSchemaField(project, { attribute: a })
          : GraphQlSchemaIdInput.byName(project, theType!) ??
            new GraphQlSchemaIdInput(project, {
              type: theType!,
            });

        // add to list of fields
        acc[camelCase(a.name)] = {
          type:
            a.type === ResourceAttributeType.ARRAY
              ? new GraphQLList(field.typeDef)
              : field.typeDef,
        };

        return acc;
      }, {} as Record<string, any>);

    this.typeDef = new GraphQLInputObjectType({
      name: this.typeName,
      fields,
    });

    //this.typeDef = new GraphQLNonNull(this.typeDef);

    return this;
  }
}
