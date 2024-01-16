import { camelCase } from "change-case";
import { GraphQLNonNull, GraphQLType } from "graphql";
import { Component } from "projen";
import { GraphQlSchemaType } from "./graphql-schema-type";
import { getGraphQLScalar } from "./scalars";
import {
  DataService,
  ResourceAttribute,
  ResourceAttributeType,
  StructureAttribute,
} from "../../services";

export type GraphqlFieldOptions = {
  attribute: StructureAttribute | ResourceAttribute;
};

export class GraphQlSchemaField extends Component {
  /**
   * Returns an attribute by name, or undefined if it doesn't exist
   */
  public static byName(
    service: DataService,
    name: string
  ): GraphQlSchemaField | undefined {
    const isDefined = (c: Component): c is GraphQlSchemaField =>
      c instanceof GraphQlSchemaField && c.name === name;
    return service.components.find(isDefined);
  }

  /**
   * the name for this field
   */
  public readonly name: string;

  /**
   * the typename for this field
   */
  public readonly fieldName: string;

  /**
   * the typename for this field
   */
  public readonly typeName: string;

  /**
   * The type fopr this field
   */
  public typeDef: GraphQLType;

  constructor(
    public readonly project: DataService,
    options: GraphqlFieldOptions
  ) {
    super(project);

    const { attribute } = options;

    this.name = attribute.name;
    this.fieldName = camelCase(attribute.name);
    this.typeName = camelCase(attribute.name);

    // get the right value
    let theType =
      attribute.type === ResourceAttributeType.ARRAY
        ? attribute.typeParameter
        : attribute.type;

    // is if a base type?
    const isBaseType = !!Object.values(ResourceAttributeType).find((t) => {
      return t === theType;
    });

    if (!theType) {
      throw new Error(`Could not find type for attribute "${attribute.name}"`);
    }

    this.typeDef = isBaseType
      ? getGraphQLScalar(theType)
      : GraphQlSchemaType.byName(project, theType)?.typeDef ??
        new GraphQlSchemaType(project, { name: theType }).typeDef;

    // it's required
    if (attribute.required) {
      this.typeDef = new GraphQLNonNull(this.typeDef);
    }

    return this;
  }
}
