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
export interface CreateTenantOutput {
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
export interface GetTenantOutput {
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
export interface UpdateTenantOutput {
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
export interface DeleteTenantOutput {
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
export interface ImportTenantInput {
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
export interface ImportTenantOutput {
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
   * This attribute can be used as part of a lookup for this record.
   */
  firstName?: string;
  /**
   * A last-name.
   * This attribute can be used as part of a lookup for this record.
   */
  lastName?: string;
}

/**
 * A gereric type
 */
export interface CreateActorInput {
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
   * This attribute can be used as part of a lookup for this record.
   */
  firstName?: string;
  /**
   * A last-name.
   * This attribute can be used as part of a lookup for this record.
   */
  lastName?: string;
}

/**
 * A gereric type
 */
export interface CreateActorOutput {
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
   * This attribute can be used as part of a lookup for this record.
   */
  firstName?: string;
  /**
   * A last-name.
   * This attribute can be used as part of a lookup for this record.
   */
  lastName?: string;
}

/**
 * A gereric type
 */
export interface GetActorInput {
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
   * This attribute can be used as part of a lookup for this record.
   */
  firstName?: string;
  /**
   * A last-name.
   * This attribute can be used as part of a lookup for this record.
   */
  lastName?: string;
}

/**
 * A gereric type
 */
export interface GetActorOutput {
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
   * This attribute can be used as part of a lookup for this record.
   */
  firstName?: string;
  /**
   * A last-name.
   * This attribute can be used as part of a lookup for this record.
   */
  lastName?: string;
}

/**
 * A gereric type
 */
export interface UpdateActorInput {
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
   * This attribute can be used as part of a lookup for this record.
   */
  firstName?: string;
  /**
   * A last-name.
   * This attribute can be used as part of a lookup for this record.
   */
  lastName?: string;
}

/**
 * A gereric type
 */
export interface UpdateActorOutput {
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
   * This attribute can be used as part of a lookup for this record.
   */
  firstName?: string;
  /**
   * A last-name.
   * This attribute can be used as part of a lookup for this record.
   */
  lastName?: string;
}

/**
 * A gereric type
 */
export interface DeleteActorInput {
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
   * This attribute can be used as part of a lookup for this record.
   */
  firstName?: string;
  /**
   * A last-name.
   * This attribute can be used as part of a lookup for this record.
   */
  lastName?: string;
}

/**
 * A gereric type
 */
export interface DeleteActorOutput {
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
   * This attribute can be used as part of a lookup for this record.
   */
  firstName?: string;
  /**
   * A last-name.
   * This attribute can be used as part of a lookup for this record.
   */
  lastName?: string;
}

/**
 * A gereric type
 */
export interface ImportActorInput {
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
   * This attribute can be used as part of a lookup for this record.
   */
  firstName?: string;
  /**
   * A last-name.
   * This attribute can be used as part of a lookup for this record.
   */
  lastName?: string;
}

/**
 * A gereric type
 */
export interface ImportActorOutput {
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
   * This attribute can be used as part of a lookup for this record.
   */
  firstName?: string;
  /**
   * A last-name.
   * This attribute can be used as part of a lookup for this record.
   */
  lastName?: string;
}

// ~~ Generated by projen. To modify, edit .projenrc.js and run "npx projen".
