import { pascalCase } from "change-case";
import { GraphQLInputObjectType, GraphQLType } from "graphql";
import { Component } from "projen";
import { GraphQlSchemaField } from "./graphql-schema-field";
import {
  DataService,
  IdentifierType,
  Resource,
  VisabilityType,
} from "../../services";

export type GraphQlSchemaIdInputOptions = {
  /**
   * the type that this is based on like "Fool"
   */
  type: string;
};

export const inputName = (name: string) => {
  return `${name}-id-input`;
};

export class GraphQlSchemaIdInput extends Component {
  /**
   * Returns an attribute by name, or undefined if it doesn't exist
   */
  public static byName(
    service: DataService,
    name: string
  ): GraphQlSchemaIdInput | undefined {
    const isDefined = (c: Component): c is GraphQlSchemaIdInput =>
      c instanceof GraphQlSchemaIdInput && c.name === inputName(name);
    return service.components.find(isDefined);
  }

  /**
   * The field name for this type, like array-of-fools.
   */
  public readonly name: string;

  /**
   * The type for this field like FoolsIdInput
   */
  public readonly typeName: string;

  /**
   * The type fopr this field
   */
  public typeDef: GraphQLType;

  constructor(
    public readonly project: DataService,
    options: GraphQlSchemaIdInputOptions
  ) {
    super(project);
    // get the origin resource this is mapped to
    const resource = Resource.byName(project, options.type);

    if (!resource) {
      throw new Error(
        `Could not find resource for attribute "${options.type}"`
      );
    }

    // GraphQl name for this type
    this.name = inputName(options.type);
    this.typeName = pascalCase(inputName(options.type));

    // build fields
    const fields = resource.attributes
      .filter(
        (a) =>
          a.visibility === VisabilityType.USER_VISIBLE &&
          a.identifier === IdentifierType.PRIMARY
      )
      .reduce((acc, a) => {
        const field =
          GraphQlSchemaField.byName(project, a.name) ??
          new GraphQlSchemaField(project, { attribute: a });

        // add to list of fields
        acc[field.fieldName] = {
          type: field.typeDef,
        };

        return acc;
      }, {} as Record<string, any>);

    this.typeDef = new GraphQLInputObjectType({
      name: this.typeName,
      fields,
    });

    return this;
  }
}
