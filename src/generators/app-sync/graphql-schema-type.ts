import { pascalCase } from "change-case";
import { GraphQLList, GraphQLObjectType, GraphQLType } from "graphql";
import { Component } from "projen";
import { GraphQlSchemaField } from "./graphql-schema-field";
import {
  DataService,
  Resource,
  ResourceAttributeType,
  VisabilityType,
} from "../../services";

export type GraphQlSchemaTypeOptions = {
  name: string;
};

export class GraphQlSchemaType extends Component {
  /**
   * Returns an attribute by name, or undefined if it doesn't exist
   */
  public static byName(
    service: DataService,
    name: string
  ): GraphQlSchemaType | undefined {
    const isDefined = (c: Component): c is GraphQlSchemaType =>
      c instanceof GraphQlSchemaType && c.name === name;
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
    options: GraphQlSchemaTypeOptions
  ) {
    super(project);

    this.name = options.name;

    // get the origin resource this is mapped to
    const structure = Resource.byName(project, this.name)?.dataStructure;

    if (!structure) {
      throw new Error(`Could not find resource for attribute "${this.name}"`);
    }

    // GraphQl name for this type
    this.typeName = pascalCase(structure.name);

    // build fields
    const fields = structure.attributes
      .filter((a) => a.visibility === VisabilityType.USER_VISIBLE)
      .reduce((acc, a) => {
        const field =
          GraphQlSchemaField.byName(project, a.name) ??
          new GraphQlSchemaField(project, { attribute: a });
        // add to list of fields
        acc[field.typeName] = {
          type:
            a.type === ResourceAttributeType.ARRAY
              ? new GraphQLList(field.typeDef)
              : field.typeDef,
        };

        return acc;
      }, {} as Record<string, any>);

    // store the type
    this.typeDef = new GraphQLObjectType({
      name: this.typeName,
      fields,
    });
    //Object.assign(types, { [typeName]: type });

    return this;
  }
}
