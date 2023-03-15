import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";
import {
  CreateUserInput,
  CreateUserOutput,
  Response,
} from "../../types";

const region = process.env.AWS_REGION || "invalid-region";
const config = {
  ...(process.env.MOCK_DYNAMODB_ENDPOINT && {
    endpoint: process.env.MOCK_DYNAMODB_ENDPOINT,
    sslEnabled: false,
    region: 'local',
  }),
}
const client = new DynamoDBClient(config);
const dynamo = DynamoDBDocumentClient.from(client);

export const createUser = async (
  input: Required<CreateUserInput>
): Promise<Response<CreateUserOutput>> => {

  const {
    firstName,
    lastName,
  } = input;

  const fn = firstName;
  const ln = lastName;

  const id = uuidv4();
  const t = "user";
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
        fn,
        ln,
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
      firstName: fn,
      lastName: ln,
    },
    errors: [],
    status: 200,
  };
};

// ~~ Generated by projen. To modify, edit .projenrc.js and run "npx projen".
