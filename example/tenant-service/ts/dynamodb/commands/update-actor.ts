import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import {
  UpdateActorInput,
  UpdateActorOutput,
  Response,
} from "../../types";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

export const updateActor = async (
  input: Required<UpdateActorInput>
): Promise<Response<UpdateActorOutput>> => {

  const {
    id,
    firstName,
    lastName,
  } = input;

  const fn = firstName;
  const ln = lastName;

  const t = "actor";
  const v = "LATEST";
  const ud = new Date().toISOString();
  const pk = id.toLowerCase();
  const sk = t.toLowerCase() + "#" + v.toLowerCase();
  const idx = fn.toLowerCase() + "#" + ln.toLowerCase();

  const result = await dynamo.send(
    new UpdateCommand({
      TableName: "tenant",
      Key: {
        pk,
        sk,
      },
    })
  );

};

// ~~ Generated by projen. To modify, edit .projenrc.js and run "npx projen".
