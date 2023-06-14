import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import {
  Error,
  UpdateUserInput,
  UpdateUserOutput,
  Response,
} from "../../types/user";

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

export const updateUser = async (
  input: UpdateUserInput
): Promise<Response<UpdateUserOutput>> => {

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
  const {
    id,
    firstName,
    lastName,
  } = input;

  const fn = firstName;
  const ln = lastName;

  /**
   * Generate needed values.
   */
  const t = "user";
  const v = new Date().toISOString();
  const ud = new Date().toISOString();
  const pk = id.toLowerCase();
  const sk = t.toLowerCase() + "#" + v.toLowerCase();

  const result = await dynamo.send(
    new UpdateCommand({
      TableName: "user",
      // ~~ Generated by projen. To modify, edit .projenrc.js and run "npx projen".
