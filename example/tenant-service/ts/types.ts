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

export interface TenantDynamo {
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

/**
 * A gereric type
 */
export interface CreateTenantInput {
  /**
   * A name.
   */
  name: string;
}

export interface CreateTenantInputDynamo {
  n?: string;
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
   * The date and time this record was deleted.
   * @readonly This attribute is managed automatically by the system.
   */
  deletedAt?: string;
  /**
   * A name.
   */
  name: string;
}

export interface CreateTenantOutputDynamo {
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

/**
 * A gereric type
 */
export interface GetTenantInput {
}

export interface GetTenantInputDynamo {
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
   * The date and time this record was deleted.
   * @readonly This attribute is managed automatically by the system.
   */
  deletedAt?: string;
  /**
   * A name.
   */
  name: string;
}

export interface GetTenantOutputDynamo {
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

/**
 * A gereric type
 */
export interface UpdateTenantInput {
  /**
   * A name.
   */
  name: string;
}

export interface UpdateTenantInputDynamo {
  n?: string;
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
   * The date and time this record was deleted.
   * @readonly This attribute is managed automatically by the system.
   */
  deletedAt?: string;
  /**
   * A name.
   */
  name: string;
}

export interface UpdateTenantOutputDynamo {
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

/**
 * A gereric type
 */
export interface DeleteTenantInput {
}

export interface DeleteTenantInputDynamo {
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
  deletedAt?: string;
  /**
   * A name.
   */
  name: string;
}

export interface DeleteTenantOutputDynamo {
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

/**
 * A gereric type
 */
export interface ImportTenantInput {
  /**
   * A name.
   */
  name: string;
}

export interface ImportTenantInputDynamo {
  n?: string;
}

/**
 * A gereric type
 */
export interface ImportTenantOutput {
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
  deletedAt?: string;
  /**
   * A name.
   */
  name: string;
}

export interface ImportTenantOutputDynamo {
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
  deletedAt?: string;
  /**
   * A first-name.
   * This attribute can be used as part of a lookup for this record.
   */
  firstName: string;
  /**
   * A last-name.
   * This attribute can be used as part of a lookup for this record.
   */
  lastName: string;
}

export interface ActorDynamo {
  id?: string;
  t?: string;
  v?: string;
  cd?: string;
  ud?: string;
  dd?: string;
  fn?: string;
  ln?: string;
  pk?: string;
  sk?: string;
  idx?: string;
}

/**
 * A gereric type
 */
export interface CreateActorInput {
  /**
   * A first-name.
   * This attribute can be used as part of a lookup for this record.
   */
  firstName: string;
  /**
   * A last-name.
   * This attribute can be used as part of a lookup for this record.
   */
  lastName: string;
}

export interface CreateActorInputDynamo {
  fn?: string;
  ln?: string;
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
   * The date and time this record was deleted.
   * @readonly This attribute is managed automatically by the system.
   */
  deletedAt?: string;
  /**
   * A first-name.
   * This attribute can be used as part of a lookup for this record.
   */
  firstName: string;
  /**
   * A last-name.
   * This attribute can be used as part of a lookup for this record.
   */
  lastName: string;
}

export interface CreateActorOutputDynamo {
  id?: string;
  t?: string;
  v?: string;
  cd?: string;
  ud?: string;
  dd?: string;
  fn?: string;
  ln?: string;
  pk?: string;
  sk?: string;
  idx?: string;
}

/**
 * A gereric type
 */
export interface GetActorInput {
}

export interface GetActorInputDynamo {
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
   * The date and time this record was deleted.
   * @readonly This attribute is managed automatically by the system.
   */
  deletedAt?: string;
  /**
   * A first-name.
   * This attribute can be used as part of a lookup for this record.
   */
  firstName: string;
  /**
   * A last-name.
   * This attribute can be used as part of a lookup for this record.
   */
  lastName: string;
}

export interface GetActorOutputDynamo {
  id?: string;
  t?: string;
  v?: string;
  cd?: string;
  ud?: string;
  dd?: string;
  fn?: string;
  ln?: string;
  pk?: string;
  sk?: string;
  idx?: string;
}

/**
 * A gereric type
 */
export interface UpdateActorInput {
  /**
   * A first-name.
   * This attribute can be used as part of a lookup for this record.
   */
  firstName: string;
  /**
   * A last-name.
   * This attribute can be used as part of a lookup for this record.
   */
  lastName: string;
}

export interface UpdateActorInputDynamo {
  fn?: string;
  ln?: string;
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
   * The date and time this record was deleted.
   * @readonly This attribute is managed automatically by the system.
   */
  deletedAt?: string;
  /**
   * A first-name.
   * This attribute can be used as part of a lookup for this record.
   */
  firstName: string;
  /**
   * A last-name.
   * This attribute can be used as part of a lookup for this record.
   */
  lastName: string;
}

export interface UpdateActorOutputDynamo {
  id?: string;
  t?: string;
  v?: string;
  cd?: string;
  ud?: string;
  dd?: string;
  fn?: string;
  ln?: string;
  pk?: string;
  sk?: string;
  idx?: string;
}

/**
 * A gereric type
 */
export interface DeleteActorInput {
}

export interface DeleteActorInputDynamo {
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
  deletedAt?: string;
  /**
   * A first-name.
   * This attribute can be used as part of a lookup for this record.
   */
  firstName: string;
  /**
   * A last-name.
   * This attribute can be used as part of a lookup for this record.
   */
  lastName: string;
}

export interface DeleteActorOutputDynamo {
  id?: string;
  t?: string;
  v?: string;
  cd?: string;
  ud?: string;
  dd?: string;
  fn?: string;
  ln?: string;
  pk?: string;
  sk?: string;
  idx?: string;
}

/**
 * A gereric type
 */
export interface ImportActorInput {
  /**
   * A first-name.
   * This attribute can be used as part of a lookup for this record.
   */
  firstName: string;
  /**
   * A last-name.
   * This attribute can be used as part of a lookup for this record.
   */
  lastName: string;
}

export interface ImportActorInputDynamo {
  fn?: string;
  ln?: string;
}

/**
 * A gereric type
 */
export interface ImportActorOutput {
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
  deletedAt?: string;
  /**
   * A first-name.
   * This attribute can be used as part of a lookup for this record.
   */
  firstName: string;
  /**
   * A last-name.
   * This attribute can be used as part of a lookup for this record.
   */
  lastName: string;
}

export interface ImportActorOutputDynamo {
  id?: string;
  t?: string;
  v?: string;
  cd?: string;
  ud?: string;
  dd?: string;
  fn?: string;
  ln?: string;
  pk?: string;
  sk?: string;
  idx?: string;
}

// ~~ Generated by projen. To modify, edit .projenrc.js and run "npx projen".
