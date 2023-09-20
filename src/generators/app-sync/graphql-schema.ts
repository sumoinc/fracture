import { camelCase } from "change-case";
import {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLSchemaConfig,
  printSchema,
} from "graphql";
import { GraphQlSchemaInput } from "./graphql-schema-input";
import { GraphQlSchemaType } from "./graphql-schema-type";
import { DataService, Operation, OperationType } from "../../services";
import { GeneratedGraphQlFile } from "../generated-graphql-file";

export class GraphqlSchema extends GeneratedGraphQlFile {
  constructor(
    public readonly project: DataService,
    filePath: string = "schema.graphql"
  ) {
    super(project, filePath);

    const schemaConfig: GraphQLSchemaConfig = {
      types: [
        // add mutations
        new GraphQLObjectType({
          name: "Mutation",
          fields: Operation.all(project)
            .filter((o) => o.operationType === OperationType.MUTATION)
            .reduce((acc, o) => {
              // find the return type for this mutation
              const returnType =
                GraphQlSchemaType.byName(project, o.outputAttribute.name) ??
                new GraphQlSchemaType(project, {
                  name: o.outputAttribute.name,
                });

              // find the input type for this mutation
              const inputType =
                GraphQlSchemaInput.byName(project, o.inputStructure.name) ??
                new GraphQlSchemaInput(project, {
                  name: o.inputStructure.name,
                });

              acc[camelCase(o.name)] = {
                type: returnType.typeDef,
                args: {
                  input: {
                    type: new GraphQLNonNull(inputType.typeDef),
                  },
                },
              };

              return acc;
            }, {} as Record<string, any>),
        }),

        // queries
        new GraphQLObjectType({
          name: "Query",
          fields: Operation.all(project)
            .filter((o) => o.operationType === OperationType.QUERY)
            .reduce((acc, o) => {
              // find the return type for this mutation
              const returnType =
                GraphQlSchemaType.byName(project, o.outputAttribute.name) ??
                new GraphQlSchemaType(project, {
                  name: o.outputAttribute.name,
                });

              // find the input type for this mutation
              const inputType =
                GraphQlSchemaInput.byName(project, o.inputStructure.name) ??
                new GraphQlSchemaInput(project, {
                  name: o.inputStructure.name,
                });

              acc[camelCase(o.name)] = {
                type: returnType.typeDef,
                args: {
                  input: {
                    type: new GraphQLNonNull(inputType.typeDef),
                  },
                },
              };
              return acc;
            }, {} as Record<string, any>),
        }),
      ],
    };
    const schema = new GraphQLSchema(schemaConfig);
    const schemaString = printSchema(schema);

    // turn into format for file - this is real dumb
    schemaString.split("\n").forEach((line) => {
      this.addLine(line);
    });
  }
}
