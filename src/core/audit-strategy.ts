import {
  ResourceAttributeGenerator,
  ResourceAttributeOptions,
  ResourceAttributeType,
} from "./resource-attribute";

export type AuditStrategy = {
  create: {
    dateAttribute?: ResourceAttributeOptions;
    userAttribute?: ResourceAttributeOptions;
  };
  update: {
    dateAttribute?: ResourceAttributeOptions;
    userAttribute?: ResourceAttributeOptions;
  };
  // turning this on activates soft deletes
  delete: {
    dateAttribute?: ResourceAttributeOptions;
    userAttribute?: ResourceAttributeOptions;
  };
};

export const defaultAuditStrategy: AuditStrategy = {
  create: {
    dateAttribute: {
      name: "createdAt",
      shortName: "cd",
      comment: [`The date and time this record was created.`],
      type: ResourceAttributeType.DATE_TIME,
      createGenerator: ResourceAttributeGenerator.CURRENT_DATE_TIME_STAMP,
    },
  },
  update: {
    dateAttribute: {
      name: "updatedAt",
      shortName: "ud",
      comment: [`The date and time this record was last updated.`],
      type: ResourceAttributeType.DATE_TIME,
      updateGenerator: ResourceAttributeGenerator.CURRENT_DATE_TIME_STAMP,
    },
  },
  delete: {
    dateAttribute: {
      name: "deletedAt",
      shortName: "dd",
      comment: [`The date and time this record was deleted.`],
      type: ResourceAttributeType.DATE_TIME,
      deleteGenerator: ResourceAttributeGenerator.CURRENT_DATE_TIME_STAMP,
    },
  },
};
