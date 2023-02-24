// ~~ Generated by projen. To modify, edit .projenrc.js and run "npx projen".

/**
 * A group.
 */
export interface Group {
  /**
   * The unique identifier for this group.
   * @type A GUID string.
   * @readonly This attribute is managed automatically by the system.
   */
  id: string;
  /**
   * The date and time this group was created.
   * @readonly This attribute is managed automatically by the system.
   */
  createdAt?: string;
  /**
   * The date and time this group was last updated.
   * @readonly This attribute is managed automatically by the system.
   */
  updatedAt?: string;
  /**
   * The date and time this group was deleted.
   * @readonly This attribute is managed automatically by the system.
   */
  deletedAt?: string;
  /**
   * The date and time this group version was created, or "LATEST" for the most recent version.
   * @readonly This attribute is managed automatically by the system.
   */
  version?: string;
  /**
   * The type for this group.
   * @readonly This attribute is managed automatically by the system.
   */
  type?: string;
  /**
   * A name.
   */
  name: string;
}
