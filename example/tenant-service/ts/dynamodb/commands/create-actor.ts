import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import {
  CreateActorInput,
  CreateActorOutput,
  Response,
  CreateActorInputDynamo,
} from "../../types";

const client = new DynamoDBClient({});
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

  const result = await dynamo.send(
    new PutCommand({
      TableName: "tenant",
      Item: {
        fn,
        ln,
      } as CreateActorInputDynamo,
    })
  );

};
// ~~ Generated by projen. To modify, edit .projenrc.js and run "npx projen".
