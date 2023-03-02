/**
 * A user.
 */
export interface User {
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
   * A first-name.
   */
  firstName?: string;
  /**
   * A last-name.
   */
  lastName?: string;
}

export interface CreateUserInput {
  /**
   * A first-name.
   */
  firstName?: string;
  /**
   * A last-name.
   */
  lastName?: string;
}

export interface CreateUserOutput {
  /**
   * The unique identifier for this record.
   * @type A GUID string.
   * @readonly This attribute is managed automatically by the system.
   */
  id: string;
}

export interface ReadUserInput {
  /**
   * The unique identifier for this record.
   * @type A GUID string.
   * @readonly This attribute is managed automatically by the system.
   */
  id: string;
}

export interface ReadUserOutput extends User {}

export interface UpdateUserInput {
  /**
   * The unique identifier for this record.
   * @type A GUID string.
   * @readonly This attribute is managed automatically by the system.
   */
  id: string;
}

export interface UpdateUserOutput {
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
   * A first-name.
   */
  firstName?: string;
  /**
   * A last-name.
   */
  lastName?: string;
}

export interface DeleteUserInput {
  /**
   * The unique identifier for this record.
   * @type A GUID string.
   * @readonly This attribute is managed automatically by the system.
   */
  id: string;
}

export interface DeleteUserOutput {
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
   * A first-name.
   */
  firstName?: string;
  /**
   * A last-name.
   */
  lastName?: string;
}

export interface ImportUserInput {
  /**
   * The unique identifier for this record.
   * @type A GUID string.
   * @readonly This attribute is managed automatically by the system.
   */
  id: string;
}

export interface ImportUserOutput {
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
   * A first-name.
   */
  firstName?: string;
  /**
   * A last-name.
   */
  lastName?: string;
}

// ~~ Generated by projen. To modify, edit .projenrc.js and run "npx projen".
