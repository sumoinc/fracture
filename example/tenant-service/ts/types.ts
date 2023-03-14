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

/**
 * A gereric type
 */
export interface Tenant {
  /**
   * A pk.
   * @readonly This attribute is managed automatically by the system.
   */
  pk?: string;
  /**
   * A sk.
   * @readonly This attribute is managed automatically by the system.
   */
  sk?: string;
  /**
   * The id for the record.
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

/**
 * A gereric type
 */
export interface TenantMessage {
  /**
   * A pk.
   * @readonly This attribute is managed automatically by the system.
   */
  pk?: string;
  /**
   * A sk.
   * @readonly This attribute is managed automatically by the system.
   */
  sk?: string;
  /**
   * The id for the record.
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

/**
 * A gereric type
 */
export interface CreateTenantInput {
  /**
   * A pk.
   * @readonly This attribute is managed automatically by the system.
   */
  pk?: string;
  /**
   * A sk.
   * @readonly This attribute is managed automatically by the system.
   */
  sk?: string;
  /**
   * The id for the record.
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

/**
 * A gereric type
 */
export interface Tenant {
  /**
   * A pk.
   * @readonly This attribute is managed automatically by the system.
   */
  pk?: string;
  /**
   * A sk.
   * @readonly This attribute is managed automatically by the system.
   */
  sk?: string;
  /**
   * The id for the record.
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

/**
 * A gereric type
 */
export interface GetTenantInput {
  /**
   * A pk.
   * @readonly This attribute is managed automatically by the system.
   */
  pk?: string;
  /**
   * A sk.
   * @readonly This attribute is managed automatically by the system.
   */
  sk?: string;
  /**
   * The id for the record.
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

/**
 * A gereric type
 */
export interface Tenant {
  /**
   * A pk.
   * @readonly This attribute is managed automatically by the system.
   */
  pk?: string;
  /**
   * A sk.
   * @readonly This attribute is managed automatically by the system.
   */
  sk?: string;
  /**
   * The id for the record.
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

/**
 * A gereric type
 */
export interface UpdateTenantInput {
  /**
   * A pk.
   * @readonly This attribute is managed automatically by the system.
   */
  pk?: string;
  /**
   * A sk.
   * @readonly This attribute is managed automatically by the system.
   */
  sk?: string;
  /**
   * The id for the record.
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

/**
 * A gereric type
 */
export interface Tenant {
  /**
   * A pk.
   * @readonly This attribute is managed automatically by the system.
   */
  pk?: string;
  /**
   * A sk.
   * @readonly This attribute is managed automatically by the system.
   */
  sk?: string;
  /**
   * The id for the record.
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

/**
 * A gereric type
 */
export interface DeleteTenantInput {
  /**
   * A pk.
   * @readonly This attribute is managed automatically by the system.
   */
  pk?: string;
  /**
   * A sk.
   * @readonly This attribute is managed automatically by the system.
   */
  sk?: string;
  /**
   * The id for the record.
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

/**
 * A gereric type
 */
export interface Tenant {
  /**
   * A pk.
   * @readonly This attribute is managed automatically by the system.
   */
  pk?: string;
  /**
   * A sk.
   * @readonly This attribute is managed automatically by the system.
   */
  sk?: string;
  /**
   * The id for the record.
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

/**
 * A gereric type
 */
export interface Actor {
  /**
   * A pk.
   * @readonly This attribute is managed automatically by the system.
   */
  pk?: string;
  /**
   * A sk.
   * @readonly This attribute is managed automatically by the system.
   */
  sk?: string;
  /**
   * The id for the record.
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
   * A first-name.
   */
  firstName?: string;
  /**
   * A last-name.
   */
  lastName?: string;
  /**
   * A idx.
   * @readonly This attribute is managed automatically by the system.
   */
  idx?: string;
}

/**
 * A gereric type
 */
export interface ActorMessage {
  /**
   * A pk.
   * @readonly This attribute is managed automatically by the system.
   */
  pk?: string;
  /**
   * A sk.
   * @readonly This attribute is managed automatically by the system.
   */
  sk?: string;
  /**
   * The id for the record.
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
   * A first-name.
   */
  firstName?: string;
  /**
   * A last-name.
   */
  lastName?: string;
  /**
   * A idx.
   * @readonly This attribute is managed automatically by the system.
   */
  idx?: string;
}

/**
 * A gereric type
 */
export interface CreateActorInput {
  /**
   * A pk.
   * @readonly This attribute is managed automatically by the system.
   */
  pk?: string;
  /**
   * A sk.
   * @readonly This attribute is managed automatically by the system.
   */
  sk?: string;
  /**
   * The id for the record.
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
   * A first-name.
   */
  firstName?: string;
  /**
   * A last-name.
   */
  lastName?: string;
  /**
   * A idx.
   * @readonly This attribute is managed automatically by the system.
   */
  idx?: string;
}

/**
 * A gereric type
 */
export interface Actor {
  /**
   * A pk.
   * @readonly This attribute is managed automatically by the system.
   */
  pk?: string;
  /**
   * A sk.
   * @readonly This attribute is managed automatically by the system.
   */
  sk?: string;
  /**
   * The id for the record.
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
   * A first-name.
   */
  firstName?: string;
  /**
   * A last-name.
   */
  lastName?: string;
  /**
   * A idx.
   * @readonly This attribute is managed automatically by the system.
   */
  idx?: string;
}

/**
 * A gereric type
 */
export interface GetActorInput {
  /**
   * A pk.
   * @readonly This attribute is managed automatically by the system.
   */
  pk?: string;
  /**
   * A sk.
   * @readonly This attribute is managed automatically by the system.
   */
  sk?: string;
  /**
   * The id for the record.
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
   * A first-name.
   */
  firstName?: string;
  /**
   * A last-name.
   */
  lastName?: string;
  /**
   * A idx.
   * @readonly This attribute is managed automatically by the system.
   */
  idx?: string;
}

/**
 * A gereric type
 */
export interface Actor {
  /**
   * A pk.
   * @readonly This attribute is managed automatically by the system.
   */
  pk?: string;
  /**
   * A sk.
   * @readonly This attribute is managed automatically by the system.
   */
  sk?: string;
  /**
   * The id for the record.
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
   * A first-name.
   */
  firstName?: string;
  /**
   * A last-name.
   */
  lastName?: string;
  /**
   * A idx.
   * @readonly This attribute is managed automatically by the system.
   */
  idx?: string;
}

/**
 * A gereric type
 */
export interface UpdateActorInput {
  /**
   * A pk.
   * @readonly This attribute is managed automatically by the system.
   */
  pk?: string;
  /**
   * A sk.
   * @readonly This attribute is managed automatically by the system.
   */
  sk?: string;
  /**
   * The id for the record.
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
   * A first-name.
   */
  firstName?: string;
  /**
   * A last-name.
   */
  lastName?: string;
  /**
   * A idx.
   * @readonly This attribute is managed automatically by the system.
   */
  idx?: string;
}

/**
 * A gereric type
 */
export interface Actor {
  /**
   * A pk.
   * @readonly This attribute is managed automatically by the system.
   */
  pk?: string;
  /**
   * A sk.
   * @readonly This attribute is managed automatically by the system.
   */
  sk?: string;
  /**
   * The id for the record.
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
   * A first-name.
   */
  firstName?: string;
  /**
   * A last-name.
   */
  lastName?: string;
  /**
   * A idx.
   * @readonly This attribute is managed automatically by the system.
   */
  idx?: string;
}

/**
 * A gereric type
 */
export interface DeleteActorInput {
  /**
   * A pk.
   * @readonly This attribute is managed automatically by the system.
   */
  pk?: string;
  /**
   * A sk.
   * @readonly This attribute is managed automatically by the system.
   */
  sk?: string;
  /**
   * The id for the record.
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
   * A first-name.
   */
  firstName?: string;
  /**
   * A last-name.
   */
  lastName?: string;
  /**
   * A idx.
   * @readonly This attribute is managed automatically by the system.
   */
  idx?: string;
}

/**
 * A gereric type
 */
export interface Actor {
  /**
   * A pk.
   * @readonly This attribute is managed automatically by the system.
   */
  pk?: string;
  /**
   * A sk.
   * @readonly This attribute is managed automatically by the system.
   */
  sk?: string;
  /**
   * The id for the record.
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
   * A first-name.
   */
  firstName?: string;
  /**
   * A last-name.
   */
  lastName?: string;
  /**
   * A idx.
   * @readonly This attribute is managed automatically by the system.
   */
  idx?: string;
}

// ~~ Generated by projen. To modify, edit .projenrc.js and run "npx projen".
