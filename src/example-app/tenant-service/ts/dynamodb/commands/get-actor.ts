import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import {
  GetActorInput,
  GetActorOutput,
  Response,
} from "../../types";

const client = new DynamoDBClient({});
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
