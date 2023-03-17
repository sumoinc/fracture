import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import {
  GetActorInput,
  GetActorOutput,
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

export const getActor = async (
  input: Required<GetActorInput>
): Promise<Response<GetActorOutput>> => {

  const {
    id,
  } = input;


  const t = "actor";
  const v = new Date().toISOString();
  const pk = id.toLowerCase();
  const sk = t.toLowerCase() + "#" + v.toLowerCase();

  const result = await dynamo.send(
    new GetCommand({
      TableName: "tenant",
      Key: {
        pk,
        sk,
      },
      ReturnConsumedCapacity: "INDEXES",
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
