import {
  ShapeAttributeGenerator,
  ShapeAttributeOptions,
  ShapeAttributeType,
} from "../model";

export type AuditStrategy = {
  create: {
    dateAttribute?: ShapeAttributeOptions;
    userAttribute?: ShapeAttributeOptions;
  };
  update: {
    dateAttribute?: ShapeAttributeOptions;
    userAttribute?: ShapeAttributeOptions;
  };
  // turning this on activates soft deletes
  delete: {
    dateAttribute?: ShapeAttributeOptions;
    userAttribute?: ShapeAttributeOptions;
  };
};

export const defaultAuditStrategy: AuditStrategy = {
  create: {
    dateAttribute: {
      name: "createdAt",
      shortName: "cd",
      comment: [`The date and time this record was created.`],
      type: ShapeAttributeType.DATE_TIME,
      createGenerator: ShapeAttributeGenerator.CURRENT_DATE_TIME_STAMP,
    },
  },
  update: {
    dateAttribute: {
      name: "updatedAt",
      shortName: "ud",
      comment: [`The date and time this record was last updated.`],
      type: ShapeAttributeType.DATE_TIME,
      updateGenerator: ShapeAttributeGenerator.CURRENT_DATE_TIME_STAMP,
    },
  },
  delete: {
    dateAttribute: {
      name: "deletedAt",
      shortName: "dd",
      comment: [`The date and time this record was deleted.`],
      type: ShapeAttributeType.DATE_TIME,
      deleteGenerator: ShapeAttributeGenerator.CURRENT_DATE_TIME_STAMP,
    },
  },
};
