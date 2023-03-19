import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import {
  DeleteGroupInput,
  DeleteGroupOutput,
  Response,
} from "../../types";

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
    region: 'local',
  }),
}
const client = new DynamoDBClient(config);
const dynamo = DynamoDBDocumentClient.from(client);

export const deleteGroup = async (
  input: Required<DeleteGroupInput>
): Promise<Response<DeleteGroupOutput>> => {

  const {
    id,
  } = input;


  const t = "group";
  const v = "DELETED";
  const pk = id.toLowerCase();
  const sk = t.toLowerCase() + "#" + v.toLowerCase();

  const result = await dynamo.send(
    new DeleteCommand({
      TableName: "user",
      Key: {
        pk,
        sk,
      },
      ReturnConsumedCapacity: "INDEXES",
      ReturnItemCollectionMetrics: "SIZE",
    })
  );

  console.log(result);
  return {
    // @ts-ignore
    data: {
    },
    errors: [],
    status: 200,
  };
};
// ~~ Generated by projen. To modify, edit .projenrc.js and run "npx projen".
