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
export interface Company {
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
export interface CompanyMessage {
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
export interface CreateCompanyInput {
  /**
   * A name.
   */
  name: string;
}

/**
 * A gereric type
 */
export interface CreateCompanyOutput {
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
export interface GetCompanyInput {
  /**
   * The id for the record.
   * @readonly This attribute is managed automatically by the system.
   */
  id: string;
}

/**
 * A gereric type
 */
export interface GetCompanyOutput {
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
export interface UpdateCompanyInput {
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
export interface UpdateCompanyOutput {
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
export interface DeleteCompanyInput {
  /**
   * The id for the record.
   * @readonly This attribute is managed automatically by the system.
   */
  id: string;
}

/**
 * A gereric type
 */
export interface DeleteCompanyOutput {
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

// ~~ Generated by projen. To modify, edit .projenrc.js and run "npx projen".