import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import {
  DynamoTenant,
  ReadTenantInput,
  ReadTenantOutput,
  Tenant,
} from "../../ts/tenant";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);
const tableName = "tenant";

export const readTenant = async (
  input: ReadTenantInput
): Promise<ReadTenantOutput> => {
  /**
   * Initialize the shape dynamo expects. This may differ from the externally
   * exposed shape.
   */
  let tenant: DynamoTenant = {
    t: "Tenant",
    v: "LATEST",
    id: input.id,
  };

  /**
   * Add key values to the shape.
   */
  tenant.pk = tenant.id;
  tenant.sk = tenant.t + "#" + tenant.v;

  /**
   * Build the key for this item.
   */
  const key = {
    pk: tenant.pk,
    sk: tenant.sk,
  };

};
// ~~ Generated by projen. To modify, edit .projenrc.js and run "npx projen".
