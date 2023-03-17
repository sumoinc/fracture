import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";
import {
  CreateActorInput,
  CreateActorOutput,
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

export const createActor = async (
  input: Required<CreateActorInput>
): Promise<Response<CreateActorOutput>> => {

  const {
    firstName,
    lastName,
  } = input;

  const fn = firstName;
  const ln = lastName;

  const id = uuidv4();
  const t = "actor";
  const v = "LATEST";
  const cd = new Date().toISOString();
  const ud = new Date().toISOString();
  const pk = id.toLowerCase();
  const sk = t.toLowerCase() + "#" + v.toLowerCase();
  const idx = fn.toLowerCase() + "#" + ln.toLowerCase();

  const result = await dynamo.send(
    new PutCommand({
      TableName: "tenant",
      Item: {
        id,
        t,
        v,
        cd,
        ud,
        fn,
        ln,
        pk,
        sk,
        idx,
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
      firstName: fn,
      lastName: ln,
    },
    errors: [],
    status: 200,
  };
};

// ~~ Generated by projen. To modify, edit .projenrc.js and run "npx projen".
