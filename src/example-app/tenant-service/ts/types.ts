export type Error = {
  code: number;
  source: string;
  message: string;
  detail: string;
}

export type Response<T> = {
  data?: T;
  errors: Error[];
  status: number;
}

export type ListResponse<T> = {
  data?: T[];
  errors: Error[];
  status: number;
}

/**
 * A gereric type
 */
export interface Tenant {
  /**
   * The id for the record.
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
  deletedAt: string;
  /**
   * A name.
   */
  name: string;
  /**
   * A nickname.
   */
  nickname?: string;
}

/**
 * A gereric type
 */
export interface TenantMessage {
  /**
   * The id for the record.
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
  deletedAt: string;
  /**
   * A name.
   */
  name: string;
  /**
   * A nickname.
   */
  nickname?: string;
}

/**
 * A gereric type
 */
export interface CreateTenantInput {
  /**
   * A name.
   */
  name: string;
  /**
   * A nickname.
   */
  nickname?: string;
}

/**
 * A gereric type
 */
export interface CreateTenantOutput {
  /**
   * The id for the record.
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
   * A name.
   */
  name: string;
  /**
   * A nickname.
   */
  nickname?: string;
}

/**
 * A gereric type
 */
export interface GetTenantInput {
  /**
   * The id for the record.
   * @readonly This attribute is managed automatically by the system.
   */
  id: string;
}

/**
 * A gereric type
 */
export interface GetTenantOutput {
  /**
   * The id for the record.
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
   * A name.
   */
  name: string;
  /**
   * A nickname.
   */
  nickname?: string;
}

/**
 * A gereric type
 */
export interface UpdateTenantInput {
  /**
   * The id for the record.
   * @readonly This attribute is managed automatically by the system.
   */
  id: string;
  /**
   * A name.
   */
  name: string;
  /**
   * A nickname.
   */
  nickname?: string;
}

/**
 * A gereric type
 */
export interface UpdateTenantOutput {
  /**
   * The id for the record.
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
   * A name.
   */
  name: string;
  /**
   * A nickname.
   */
  nickname?: string;
}

/**
 * A gereric type
 */
export interface DeleteTenantInput {
  /**
   * The id for the record.
   * @readonly This attribute is managed automatically by the system.
   */
  id: string;
}

/**
 * A gereric type
 */
export interface DeleteTenantOutput {
  /**
   * The id for the record.
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
  deletedAt: string;
  /**
   * A name.
   */
  name: string;
  /**
   * A nickname.
   */
  nickname?: string;
}

/**
 * A gereric type
 */
export interface ListTenantInput {
}

/**
 * A gereric type
 */
export interface ListTenantOutput {
}

/**
 * A gereric type
 */
export interface Actor {
  /**
   * The id for the record.
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
  deletedAt: string;
  /**
   * A first-name.
   */
  firstName: string;
  /**
   * A last-name.
   */
  lastName: string;
}

/**
 * A gereric type
 */
export interface ActorMessage {
  /**
   * The id for the record.
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
  deletedAt: string;
  /**
   * A first-name.
   */
  firstName: string;
  /**
   * A last-name.
   */
  lastName: string;
}

/**
 * A gereric type
 */
export interface CreateActorInput {
  /**
   * A first-name.
   */
  firstName: string;
  /**
   * A last-name.
   */
  lastName: string;
}

/**
 * A gereric type
 */
export interface CreateActorOutput {
  /**
   * The id for the record.
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
   * A first-name.
   */
  firstName: string;
  /**
   * A last-name.
   */
  lastName: string;
}

/**
 * A gereric type
 */
export interface GetActorInput {
  /**
   * The id for the record.
   * @readonly This attribute is managed automatically by the system.
   */
  id: string;
}

/**
 * A gereric type
 */
export interface GetActorOutput {
  /**
   * The id for the record.
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
   * A first-name.
   */
  firstName: string;
  /**
   * A last-name.
   */
  lastName: string;
}

/**
 * A gereric type
 */
export interface UpdateActorInput {
  /**
   * The id for the record.
   * @readonly This attribute is managed automatically by the system.
   */
  id: string;
  /**
   * A first-name.
   */
  firstName: string;
  /**
   * A last-name.
   */
  lastName: string;
}

/**
 * A gereric type
 */
export interface UpdateActorOutput {
  /**
   * The id for the record.
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
   * A first-name.
   */
  firstName: string;
  /**
   * A last-name.
   */
  lastName: string;
}

/**
 * A gereric type
 */
export interface DeleteActorInput {
  /**
   * The id for the record.
   * @readonly This attribute is managed automatically by the system.
   */
  id: string;
}

/**
 * A gereric type
 */
export interface DeleteActorOutput {
  /**
   * The id for the record.
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
  deletedAt: string;
  /**
   * A first-name.
   */
  firstName: string;
  /**
   * A last-name.
   */
  lastName: string;
}

/**
 * A gereric type
 */
export interface ListActorInput {
}

/**
 * A gereric type
 */
export interface ListActorOutput {
}

// ~~ Generated by projen. To modify, edit .projenrc.js and run "npx projen".
