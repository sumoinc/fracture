import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import {
  DeleteUserInput,
  DeleteUserOutput,
  Response,
} from "../../types";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

export const deleteUser = async (
  input: Required<DeleteUserInput>
): Promise<Response<DeleteUserOutput>> => {

  const {
    id,
  } = input;


  const t = "user";
  const v = "DELETED";
  const pk = id.toLowerCase();
  const sk = t.toLowerCase() + "#" + v.toLowerCase();

  const result = await dynamo.send(
    new DeleteCommand({
      TableName: "user",
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
      deletedAt: dd,
      firstName: fn,
      lastName: ln,
    },
    errors: [],
    status: 200,
  };
};

// ~~ Generated by projen. To modify, edit .projenrc.js and run "npx projen".
