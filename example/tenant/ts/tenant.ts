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
  name: string;
}

export interface CreateTenantInput {
  /**
   * A name.
   */
  name: string;
}

export interface CreateTenantOutput {
  /**
   * The unique identifier for this record.
   * @type A GUID string.
   * @readonly This attribute is managed automatically by the system.
   */
  id: string;
}

export interface ReadTenantInput {
  /**
   * The unique identifier for this record.
   * @type A GUID string.
   * @readonly This attribute is managed automatically by the system.
   */
  id: string;
}

export interface ReadTenantOutput extends Tenant {}

export interface UpdateTenantInput {
  /**
   * The unique identifier for this record.
   * @type A GUID string.
   * @readonly This attribute is managed automatically by the system.
   */
  id: string;
}

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
  name: string;
}

export interface DeleteTenantInput {
  /**
   * The unique identifier for this record.
   * @type A GUID string.
   * @readonly This attribute is managed automatically by the system.
   */
  id: string;
}

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
  name: string;
}

export interface ImportTenantInput {
  /**
   * The unique identifier for this record.
   * @type A GUID string.
   * @readonly This attribute is managed automatically by the system.
   */
  id: string;
}

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
  name: string;
}

// ~~ Generated by projen. To modify, edit .projenrc.js and run "npx projen".
