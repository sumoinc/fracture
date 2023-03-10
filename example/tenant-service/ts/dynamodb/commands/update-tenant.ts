import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

/**
 * A gereric type
 */
export interface UpdateTenantInput {
  /**
   * The unique identifier for this record.
   * @type A GUID string.
   * @readonly This attribute is managed automatically by the system.
   */
  id?: string;
  /**
   * A name.
   */
  name?: string;
}

/**
 * A gereric type
 */
export interface UpdateTenantOutput {
  /**
   * The unique identifier for this record.
   * @type A GUID string.
   * @readonly This attribute is managed automatically by the system.
   */
  id?: string;
  /**
   * The type for this record.
   * @readonly This attribute is managed automatically by the system.
   */
  type?: string;
  /**
   * The version of this record
   * @default "LATEST"
   * @readonly This attribute is managed automatically by the system.
   */
  version?: string;
  /**
   * The date and time this record was created.
   * @readonly This attribute is managed automatically by the system.
   */
  createdAt?: string;
  /**
   * The date and time this record was last updated.
   * @readonly This attribute is managed automatically by the system.
   */
  updatedAt?: string;
  /**
   * The date and time this record was deleted.
   * @readonly This attribute is managed automatically by the system.
   */
  deletedAt?: string;
  /**
   * A name.
   */
  name?: string;
}

interface UpdateTenantInputDynamo {
  id?: string;
  t?: string;
  v?: string;
  ud?: string;
  n?: string;
  pk?: string;
  sk?: string;
  idx?: string;
}

interface UpdateTenantOutputDynamo {
  id?: string;
  t?: string;
  v?: string;
  cd?: string;
  ud?: string;
  dd?: string;
  n?: string;
  pk?: string;
  sk?: string;
  idx?: string;
}

export const updateTenant = async (
  input: Required<UpdateTenantInput>
): Promise<UpdateTenantOutput> => {

  const {
    id,
    name,
  } = input;

  const id = generated;
  const t = "tenant";
  const v = "LATEST";
  const ud = new Date().toISOString();
  const n = name;
  const pk = id;
  const sk = t + "#" + v;
  // const idx = undefined;

  const item: UpdateTenantInputDynamo = {
    id,
    t,
    v,
    ud,
    n,
    pk,
    sk,
    // idx,
  };

};
// ~~ Generated by projen. To modify, edit .projenrc.js and run "npx projen".