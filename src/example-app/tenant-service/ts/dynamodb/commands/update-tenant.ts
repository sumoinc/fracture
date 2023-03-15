import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import {
  UpdateTenantInput,
  UpdateTenantOutput,
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

export const updateTenant = async (
  input: Required<UpdateTenantInput>
): Promise<Response<UpdateTenantOutput>> => {

  const {
    id,
    name,
    nickname,
  } = input;

  const n = name;
  const nn = nickname;

  const t = "tenant";
  const v = "LATEST";
  const ud = new Date().toISOString();
  const pk = id.toLowerCase();
  const sk = t.toLowerCase() + "#" + v.toLowerCase();
  const idx = n.toLowerCase();

  const result = await dynamo.send(
    new UpdateCommand({
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
      name: n,
      nickname: nn,
    },
    errors: [],
    status: 200,
  };
};

// ~~ Generated by projen. To modify, edit .projenrc.js and run "npx projen".
