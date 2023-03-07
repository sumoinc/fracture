import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import {
  DynamoActor,
  DynamoKey,
  Actor
} from "../../types";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

export const deleteActor = async (
  input: Required<Actor>
): Promise<Actor> => {
  /**
   * Initialize the shape dynamo expects. This may differ from the externally
   * exposed shape.
   */
  const item: Required<Pick<DynamoActor, "t" | "v" | "dd" | "an">> = {
    t: "Actor",
    v: "LATEST",
    dd: new Date().toISOString(),
    an: input.actorName,
  };

  /**
   * Add key values to the shape.
   */
  const key: DynamoKey = {
    pk: item.id,
    sk: item.t + "#" + item.v,
  };

  const result = await dynamo.send(
    new DeleteCommand({
      TableName: "tenant",
      Key: marshall(key),
    })
  );

  return item as Actor;
};
// ~~ Generated by projen. To modify, edit .projenrc.js and run "npx projen".
