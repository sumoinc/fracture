export interface DynamoKey {
  pk: string;
  sk: string;
}

/**
 * A tenant.
 */
export interface Tenant {
  /**
   * The unique identifier for this record.
   * @type A GUID string.
   * @readonly This attribute is managed automatically by the system.
   */
  id: string;
  /**
   * The type for this record.
   * @readonly This attribute is managed automatically by the system.
   */
  type: string;
  /**
   * The version of this record
   * @default "LATEST"
   * @readonly This attribute is managed automatically by the system.
   */
  version: string;
  /**
   * The date and time this record was created.
   * @readonly This attribute is managed automatically by the system.
   */
  createdAt: string;
  /**
   * The date and time this record was last updated.
   * @readonly This attribute is managed automatically by the system.
   */
  updatedAt: string;
  /**
   * The date and time this record was deleted.
   * @readonly This attribute is managed automatically by the system.
   */
  deletedAt?: string;
  /**
   * A name.
   */
  name: string;
}

export interface DynamoTenant extends DynamoKey {
  /**
   * The unique identifier for this record.
   * @type A GUID string.
   * @readonly This attribute is managed automatically by the system.
   */
  id: string;
  /**
   * The type for this record.
   * @readonly This attribute is managed automatically by the system.
   */
  t: string;
  /**
   * The version of this record
   * @default "LATEST"
   * @readonly This attribute is managed automatically by the system.
   */
  v: string;
  /**
   * The date and time this record was created.
   * @readonly This attribute is managed automatically by the system.
   */
  cd: string;
  /**
   * The date and time this record was last updated.
   * @readonly This attribute is managed automatically by the system.
   */
  ud: string;
  /**
   * The date and time this record was deleted.
   * @readonly This attribute is managed automatically by the system.
   */
  dd?: string;
  /**
   * A name.
   */
  name: string;
}

/**
 * A actor.
 */
export interface Actor {
  /**
   * The unique identifier for this record.
   * @type A GUID string.
   * @readonly This attribute is managed automatically by the system.
   */
  id: string;
  /**
   * The type for this record.
   * @readonly This attribute is managed automatically by the system.
   */
  type: string;
  /**
   * The version of this record
   * @default "LATEST"
   * @readonly This attribute is managed automatically by the system.
   */
  version: string;
  /**
   * The date and time this record was created.
   * @readonly This attribute is managed automatically by the system.
   */
  createdAt: string;
  /**
   * The date and time this record was last updated.
   * @readonly This attribute is managed automatically by the system.
   */
  updatedAt: string;
  /**
   * The date and time this record was deleted.
   * @readonly This attribute is managed automatically by the system.
   */
  deletedAt?: string;
  /**
   * A actor-name.
   */
  actorName: string;
}

export interface DynamoActor extends DynamoKey {
  /**
   * The unique identifier for this record.
   * @type A GUID string.
   * @readonly This attribute is managed automatically by the system.
   */
  id: string;
  /**
   * The type for this record.
   * @readonly This attribute is managed automatically by the system.
   */
  t: string;
  /**
   * The version of this record
   * @default "LATEST"
   * @readonly This attribute is managed automatically by the system.
   */
  v: string;
  /**
   * The date and time this record was created.
   * @readonly This attribute is managed automatically by the system.
   */
  cd: string;
  /**
   * The date and time this record was last updated.
   * @readonly This attribute is managed automatically by the system.
   */
  ud: string;
  /**
   * The date and time this record was deleted.
   * @readonly This attribute is managed automatically by the system.
   */
  dd?: string;
  /**
   * A actor-name.
   */
  actorname: string;
}

export type AnyResource =
  | Tenant
  | Actor

export type Error = {
  code: number;
  source: string;
  message: string;
  detail: string;
}

export type Response<T> = {
  data: T | T[];
  errors: Error[];
  status: number;
}

// ~~ Generated by projen. To modify, edit .projenrc.js and run "npx projen".
