import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import {
  Error,
  GetCompanyInput,
  GetCompanyOutput,
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

export const getCompany = async (
  input: GetCompanyInput
): Promise<Response<GetCompanyOutput>> => {
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
  const v = "latest";
  const pk = id.toLowerCase();
  const sk = t.toLowerCase() + "#" + v.toLowerCase();

  const result = await dynamo.send(
    new GetCommand({
      TableName: "company",
      Key: {
        pk,
        sk,
      },
      ReturnConsumedCapacity: "INDEXES",
    })
  );

  /**
   * Expand/comnvert data to output format.
   */
  const data = result.Item
    ? {
        id: result.Item.id,
        type: result.Item.t,
        version: result.Item.v,
        createdAt: result.Item.cd,
        updatedAt: result.Item.ud,
        name: result.Item.nm,
      }
    : undefined;

  /**
   * Log error if no records found.
   */
  if (!result.Item) {
    status = 404;
    errors.push({
      code: 12345,
      source: "TODO",
      message: "TODO - Item not found based on inputs.",
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
