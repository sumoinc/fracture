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
export interface User {
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
  lastName?: string;
}

/**
 * A gereric type
 */
export interface UserMessage {
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
  lastName?: string;
}

/**
 * A gereric type
 */
export interface CreateUserInput {
  /**
   * A first-name.
   */
  firstName: string;
  /**
   * A last-name.
   */
  lastName?: string;
}

/**
 * A gereric type
 */
export interface CreateUserOutput {
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
  lastName?: string;
}

/**
 * A gereric type
 */
export interface GetUserInput {
  /**
   * The id for the record.
   * @readonly This attribute is managed automatically by the system.
   */
  id: string;
}

/**
 * A gereric type
 */
export interface GetUserOutput {
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
  lastName?: string;
}

/**
 * A gereric type
 */
export interface UpdateUserInput {
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
  lastName?: string;
}

/**
 * A gereric type
 */
export interface UpdateUserOutput {
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
  lastName?: string;
}

/**
 * A gereric type
 */
export interface DeleteUserInput {
  /**
   * The id for the record.
   * @readonly This attribute is managed automatically by the system.
   */
  id: string;
}

/**
 * A gereric type
 */
export interface DeleteUserOutput {
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
  lastName?: string;
}

/**
 * A gereric type
 */
export interface CreateUserVersionInput {
}

/**
 * A gereric type
 */
export interface CreateUserVersionOutput {
}

/**
 * A gereric type
 */
export interface GetUserVersionInput {
}

/**
 * A gereric type
 */
export interface GetUserVersionOutput {
}

/**
 * A gereric type
 */
export interface Group {
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
}

/**
 * A gereric type
 */
export interface GroupMessage {
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
}

/**
 * A gereric type
 */
export interface CreateGroupInput {
  /**
   * A name.
   */
  name: string;
}

/**
 * A gereric type
 */
export interface CreateGroupOutput {
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
}

/**
 * A gereric type
 */
export interface GetGroupInput {
  /**
   * The id for the record.
   * @readonly This attribute is managed automatically by the system.
   */
  id: string;
}

/**
 * A gereric type
 */
export interface GetGroupOutput {
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
}

/**
 * A gereric type
 */
export interface UpdateGroupInput {
  /**
   * The id for the record.
   * @readonly This attribute is managed automatically by the system.
   */
  id: string;
  /**
   * A name.
   */
  name: string;
}

/**
 * A gereric type
 */
export interface UpdateGroupOutput {
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
}

/**
 * A gereric type
 */
export interface DeleteGroupInput {
  /**
   * The id for the record.
   * @readonly This attribute is managed automatically by the system.
   */
  id: string;
}

/**
 * A gereric type
 */
export interface DeleteGroupOutput {
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
}

/**
 * A gereric type
 */
export interface CreateGroupVersionInput {
}

/**
 * A gereric type
 */
export interface CreateGroupVersionOutput {
}

/**
 * A gereric type
 */
export interface GetGroupVersionInput {
}

/**
 * A gereric type
 */
export interface GetGroupVersionOutput {
}

// ~~ Generated by projen. To modify, edit .projenrc.js and run "npx projen".
