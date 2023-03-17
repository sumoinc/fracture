import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";
import {
  CreateGroupInput,
  CreateGroupOutput,
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
console.log(config, process.env.MOCK_DYNAMODB_ENDPOINT)
const client = new DynamoDBClient(config);
const dynamo = DynamoDBDocumentClient.from(client);

export const createGroup = async (
  input: Required<CreateGroupInput>
): Promise<Response<CreateGroupOutput>> => {

  const {
    name,
  } = input;


  const id = uuidv4();
  const t = "group";
  const v = "LATEST";
  const cd = new Date().toISOString();
  const ud = new Date().toISOString();
  const pk = id.toLowerCase();
  const sk = t.toLowerCase() + "#" + v.toLowerCase();

  const result = await dynamo.send(
    new PutCommand({
      TableName: "user",
      Item: {
        id,
        t,
        v,
        cd,
        ud,
        name,
        pk,
        sk,
      },
    })
  );

  console.log(result);
  return {
    data: {
      id: id,
      type: t,
      version: v,
      createdAt: cd,
      updatedAt: ud,
      name: name,
    },
    errors: [],
    status: 200,
  };
};

// ~~ Generated by projen. To modify, edit .projenrc.js and run "npx projen".
