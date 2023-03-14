import { AttributeOptions } from "./attribute.ts-delete";

export type AuditStrategy = {
  create: {
    dateAttribute?: AttributeOptions;
    userAttribute?: AttributeOptions;
  };
  update: {
    dateAttribute?: AttributeOptions;
    userAttribute?: AttributeOptions;
  };
  // turning this on activates soft deletes
  delete: {
    dateAttribute?: AttributeOptions;
    userAttribute?: AttributeOptions;
  };
};
