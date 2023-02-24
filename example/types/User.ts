// ~~ Generated by projen. To modify, edit .projenrc.js and run "npx projen".

/**
 * A User.
 */
export interface User {
  /**
   * The unique identifier for this User.
   * @type A GUID string.
   * @readonly This attribute is managed automatically by the system.
   */
  id: string;
  /**
   * The date and time this User was created.
   * @readonly This attribute is managed automatically by the system.
   */
  createdAt?: string;
  /**
   * The date and time this User was last updated.
   * @readonly This attribute is managed automatically by the system.
   */
  updatedAt?: string;
  /**
   * The date and time this User was deleted.
   * @readonly This attribute is managed automatically by the system.
   */
  deletedAt?: string;
  /**
   * The date and time this User version was created, or "LATEST" for the most recent version.
   * @readonly This attribute is managed automatically by the system.
   */
  version?: string;
  /**
   * The type for this User.
   * @readonly This attribute is managed automatically by the system.
   */
  type?: string;
  /**
   * A firstName.
   */
  firstName?: string;
  /**
   * A lastName.
   */
  lastName?: string;
}