import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

/**
 * A gereric type
 */
export interface ImportTenantInput {
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
export interface ImportTenantOutput {
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

interface ImportTenantInputDynamo {
  id?: string;
  t?: string;
  v?: string;
  cd?: string;
  ud?: string;
  n?: string;
  pk?: string;
  sk?: string;
  idx?: string;
}

interface ImportTenantOutputDynamo {
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

export const importTenant = async (
  input: Required<ImportTenantInput>
): Promise<ImportTenantOutput> => {

  const {
    id,
    name,
  } = input;

  const id = generated;
  const t = "tenant";
  const v = "LATEST";
  const cd = new Date().toISOString();
  const ud = new Date().toISOString();
  const n = name;
  const pk = id;
  const sk = t + "#" + v;
  // const idx = undefined;

  const item: ImportTenantInputDynamo = {
    id,
    t,
    v,
    cd,
    ud,
    n,
    pk,
    sk,
    // idx,
  };

};
// ~~ Generated by projen. To modify, edit .projenrc.js and run "npx projen".
