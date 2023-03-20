import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";
import {
  Error,
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
const client = new DynamoDBClient(config);
const dynamo = DynamoDBDocumentClient.from(client);

export const createActor = async (
  input: CreateActorInput
): Promise<Response<CreateActorOutput>> => {

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
    firstName,
    lastName,
  } = input;

  const fn = firstName;
  const ln = lastName;

  /**
   * Generate needed values.
   */
  const id = uuidv4();
  const t = "actor";
  const v = "latest";
  const cd = new Date().toISOString();
  const ud = new Date().toISOString();
  const pk = id.toLowerCase();
  const sk = t.toLowerCase() + "#" + v.toLowerCase();
  const idx = fn.toLowerCase() + " " + ln.toLowerCase();

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
      ReturnConsumedCapacity: "INDEXES",
      ReturnItemCollectionMetrics: "SIZE",
    })
  );

  /**
   * Expand/comnvert data to output format.
   */
  const data = {
    id: id,
    type: t,
    version: v,
    createdAt: cd,
    updatedAt: ud,
    firstName: fn,
    lastName: ln,
  };

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
