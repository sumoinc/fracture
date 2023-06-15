import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import {
  Error,
  DeleteCompanyInput,
  DeleteCompanyOutput,
  Response,
} from "../../types/company";

/**
 * Generate a DynamoDB client, configure it to use a local endpoint when needed
 * to support unit testing with dynalite.
 *
 * https://www.npmjs.com/package/jest-dynalite
 */
const config = {
  ...(process.env.MOCK_DYNAMODB_ENDPOINT && {
    endpoint: process.env.MOCK_DYNAMODB_ENDPOINT,
    sslEnabled: false,
    region: "local",
  }),
};
const client = new DynamoDBClient(config);
const dynamo = DynamoDBDocumentClient.from(client);

export const deleteCompany = async (
  input: DeleteCompanyInput
): Promise<Response<DeleteCompanyOutput>> => {
  /**
   * An error container in case we encounter problems along the way.
   */
  const errors = [] as Error[];

  /**
   * Assume things will go well (until they don't).
   */
  let status = 200;

  /**
   * Unwrap external inputs.
   */
  const { id } = input;

  /**
   * Generate needed values.
   */
  const t = "company";
  const v = new Date().toISOString();
  const pk = id.toLowerCase();
  const sk = t.toLowerCase() + "#" + v.toLowerCase();

  const result = await dynamo.send(
    new DeleteCommand({
      TableName: "company",
      Key: {
        pk,
        sk,
      },
      ReturnValues: "ALL_OLD",
      ReturnConsumedCapacity: "INDEXES",
      ReturnItemCollectionMetrics: "SIZE",
    })
  );

  const data = result.Attributes
    ? {
        id: result.Attributes.id,
        type: result.Attributes.t,
        version: result.Attributes.v,
        createdAt: result.Attributes.cd,
        updatedAt: result.Attributes.ud,
        deletedAt: result.Attributes.dd,
        name: result.Attributes.nm,
      }
    : undefined;

  /**
   * Log error if no records found.
   */
  if (!result.Attributes) {
    status = 404;
    errors.push({
      code: 12345,
      source: "TODO",
      message: "TODO - Attributes not found based on inputs.",
      detail: "TODO",
    });
  }

  /**
   * Return result.
   */
  return {
    data,
    errors,
    status,
  };
};

// ~~ Generated by projen. To modify, edit .projenrc.js and run "npx projen".
