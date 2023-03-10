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

export interface TenantDynamo {
  pk?: string;
  sk?: string;
  idx?: string;
  id?: string;
  t?: string;
  v?: string;
  cd?: string;
  ud?: string;
  dd?: string;
  n?: string;
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

/**
 * A gereric type
 */
export interface CreateTenantOutput {
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
  /**
   * The unique identifier for this record.
   * @type A GUID string.
   * @readonly This attribute is managed automatically by the system.
   */
  id: string;
}

export interface GetTenantInputDynamo {
  id?: string;
  t?: string;
  v?: string;
  pk?: string;
  sk?: string;
  idx?: string;
}

/**
 * A gereric type
 */
export interface GetTenantOutput {
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
   * The unique identifier for this record.
   * @type A GUID string.
   * @readonly This attribute is managed automatically by the system.
   */
  id: string;
  /**
   * A name.
   */
  name: string;
}

export interface UpdateTenantInputDynamo {
  id?: string;
  t?: string;
  v?: string;
  ud?: string;
  n?: string;
  pk?: string;
  sk?: string;
  idx?: string;
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
  /**
   * The unique identifier for this record.
   * @type A GUID string.
   * @readonly This attribute is managed automatically by the system.
   */
  id: string;
}

export interface DeleteTenantInputDynamo {
  id?: string;
  t?: string;
  v?: string;
  ud?: string;
  dd?: string;
  pk?: string;
  sk?: string;
}

/**
 * A gereric type
 */
export interface DeleteTenantOutput {
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

export interface DeleteTenantOutputDynamo {
  idx?: string;
  id?: string;
  t?: string;
  v?: string;
  cd?: string;
  ud?: string;
  dd?: string;
  n?: string;
  pk?: string;
  sk?: string;
}

/**
 * A gereric type
 */
export interface ImportTenantInput {
  /**
   * The unique identifier for this record.
   * @type A GUID string.
   * @readonly This attribute is managed automatically by the system.
   */
  id: string;
  /**
   * A name.
   */
  name: string;
}

export interface ImportTenantInputDynamo {
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

/**
 * A gereric type
 */
export interface ImportTenantOutput {
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
   * A first-name.
   * This attribute can be used to lookup this record.
   */
  firstName: string;
  /**
   * A last-name.
   * This attribute can be used to lookup this record.
   */
  lastName: string;
}

export interface ActorDynamo {
  pk?: string;
  sk?: string;
  idx?: string;
  id?: string;
  t?: string;
  v?: string;
  cd?: string;
  ud?: string;
  dd?: string;
  fn?: string;
  ln?: string;
}

/**
 * A gereric type
 */
export interface CreateActorInput {
  /**
   * A first-name.
   * This attribute can be used to lookup this record.
   */
  firstName: string;
  /**
   * A last-name.
   * This attribute can be used to lookup this record.
   */
  lastName: string;
}

export interface CreateActorInputDynamo {
  id?: string;
  t?: string;
  v?: string;
  cd?: string;
  ud?: string;
  fn?: string;
  ln?: string;
  pk?: string;
  sk?: string;
  idx?: string;
}

/**
 * A gereric type
 */
export interface CreateActorOutput {
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
   * A first-name.
   * This attribute can be used to lookup this record.
   */
  firstName: string;
  /**
   * A last-name.
   * This attribute can be used to lookup this record.
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
  /**
   * The unique identifier for this record.
   * @type A GUID string.
   * @readonly This attribute is managed automatically by the system.
   */
  id: string;
}

export interface GetActorInputDynamo {
  id?: string;
  t?: string;
  v?: string;
  pk?: string;
  sk?: string;
  idx?: string;
}

/**
 * A gereric type
 */
export interface GetActorOutput {
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
   * A first-name.
   * This attribute can be used to lookup this record.
   */
  firstName: string;
  /**
   * A last-name.
   * This attribute can be used to lookup this record.
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
   * The unique identifier for this record.
   * @type A GUID string.
   * @readonly This attribute is managed automatically by the system.
   */
  id: string;
  /**
   * A first-name.
   * This attribute can be used to lookup this record.
   */
  firstName: string;
  /**
   * A last-name.
   * This attribute can be used to lookup this record.
   */
  lastName: string;
}

export interface UpdateActorInputDynamo {
  id?: string;
  t?: string;
  v?: string;
  ud?: string;
  fn?: string;
  ln?: string;
  pk?: string;
  sk?: string;
  idx?: string;
}

/**
 * A gereric type
 */
export interface UpdateActorOutput {
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
   * A first-name.
   * This attribute can be used to lookup this record.
   */
  firstName: string;
  /**
   * A last-name.
   * This attribute can be used to lookup this record.
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
  /**
   * The unique identifier for this record.
   * @type A GUID string.
   * @readonly This attribute is managed automatically by the system.
   */
  id: string;
}

export interface DeleteActorInputDynamo {
  id?: string;
  t?: string;
  v?: string;
  ud?: string;
  dd?: string;
  pk?: string;
  sk?: string;
}

/**
 * A gereric type
 */
export interface DeleteActorOutput {
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
   * A first-name.
   * This attribute can be used to lookup this record.
   */
  firstName: string;
  /**
   * A last-name.
   * This attribute can be used to lookup this record.
   */
  lastName: string;
}

export interface DeleteActorOutputDynamo {
  idx?: string;
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
}

/**
 * A gereric type
 */
export interface ImportActorInput {
  /**
   * The unique identifier for this record.
   * @type A GUID string.
   * @readonly This attribute is managed automatically by the system.
   */
  id: string;
  /**
   * A first-name.
   * This attribute can be used to lookup this record.
   */
  firstName: string;
  /**
   * A last-name.
   * This attribute can be used to lookup this record.
   */
  lastName: string;
}

export interface ImportActorInputDynamo {
  id?: string;
  t?: string;
  v?: string;
  cd?: string;
  ud?: string;
  fn?: string;
  ln?: string;
  pk?: string;
  sk?: string;
  idx?: string;
}

/**
 * A gereric type
 */
export interface ImportActorOutput {
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
   * A first-name.
   * This attribute can be used to lookup this record.
   */
  firstName: string;
  /**
   * A last-name.
   * This attribute can be used to lookup this record.
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
