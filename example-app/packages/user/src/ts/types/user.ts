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
 * A generic type
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
  lastName: string;
}

/**
 * A generic type
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
  lastName: string;
}
