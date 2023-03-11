import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import {
  DeleteTenantInput,
  DeleteTenantOutput,
  Response,
  DeleteTenantInputDynamo,
} from "../../types";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

export const deleteTenant = async (
  input: Required<DeleteTenantInput>
): Promise<Response<DeleteTenantOutput>> => {

  const {
  } = input;


  const result = await dynamo.send(
    new UpdateCommand({
      TableName: "tenant",
      UpdateExpression: "set ",
      ExpressionAttributeValues: {
      },
      ExpressionAttributeNames: {
      },
      Key: {
        pk,
        sk,
      },
    })
  );

};
// ~~ Generated by projen. To modify, edit .projenrc.js and run "npx projen".
