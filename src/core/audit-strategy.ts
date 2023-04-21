import { ResourceAttributeOptions } from "./resource-attribute";

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
