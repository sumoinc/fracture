import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLScalarType,
  GraphQLString,
} from "graphql";

export const getGraphQLScalar = (type: string): GraphQLScalarType => {
  if (GRAPHQL_SCALAR_MAP[type] === undefined) {
    throw new Error(`scalar of type: ${type} does not exist`);
  }
  return GRAPHQL_SCALAR_MAP[type];
};

export const AWSDate: GraphQLScalarType = new GraphQLScalarType({
  name: "AWSDate",
  serialize: (data) => data,
});

export const AWSTime: GraphQLScalarType = new GraphQLScalarType({
  name: "AWSTime",
  serialize: (data) => data,
});

export const AWSDateTime: GraphQLScalarType = new GraphQLScalarType({
  name: "AWSDateTime",
  serialize: (data) => data,
});

export const AWSTimestamp: GraphQLScalarType = new GraphQLScalarType({
  name: "AWSTimestamp",
  serialize: (data) => data,
});

export const AWSEmail: GraphQLScalarType = new GraphQLScalarType({
  name: "AWSEmail",
  serialize: (data) => data,
});

export const AWSJSON: GraphQLScalarType = new GraphQLScalarType({
  name: "AWSJSON",
  serialize: (data) => data,
});

export const AWSURL: GraphQLScalarType = new GraphQLScalarType({
  name: "AWSURL",
  serialize: (data) => data,
});

export const AWSPhone: GraphQLScalarType = new GraphQLScalarType({
  name: "AWSPhone",
  serialize: (data) => data,
});

export const AWSIPAddress: GraphQLScalarType = new GraphQLScalarType({
  name: "AWSIPAddress",
  serialize: (data) => data,
});

export const GRAPHQL_SCALAR_MAP: { [key: string]: GraphQLScalarType } = {
  ID: GraphQLID,
  String: GraphQLString,
  Int: GraphQLInt,
  Float: GraphQLFloat,
  Boolean: GraphQLBoolean,
  Date: AWSDate,
  Time: AWSTime,
  DateTime: AWSDateTime,
  Timestamp: AWSTimestamp,
  Email: AWSEmail,
  JSON: AWSJSON,
  URL: AWSURL,
  Phone: AWSPhone,
  IPAddress: AWSIPAddress,
};
