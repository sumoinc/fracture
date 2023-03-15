import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import {
  DeleteActorInput,
  DeleteActorOutput,
  Response,
} from "../../types";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

export const deleteActor = async (
  input: Required<DeleteActorInput>
): Promise<Response<DeleteActorOutput>> => {

  const {
    id,
  } = input;


  const t = "actor";
  const v = "DELETED";
  const pk = id.toLowerCase();
  const sk = t.toLowerCase() + "#" + v.toLowerCase();

  const result = await dynamo.send(
    new DeleteCommand({
      TableName: "tenant",
      Key: {
        pk,
        sk,
      },
    })
  );

};

// ~~ Generated by projen. To modify, edit .projenrc.js and run "npx projen".
