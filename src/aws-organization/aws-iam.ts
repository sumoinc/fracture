/**
 * AWS Managed policies.
 */
export const IamManagedPolicy = {
  ADMINISTRATOR_ACCESS: "AdministratorAccess",
  BILLING: "Billing",
  DATABASE_ADMINISTRATOR: "DatabaseAdministrator",
  DATA_SCIENTIST: "DataScientist",
  NETWORK_ADMINISTRATOR: "NetworkAdministrator",
  POWER_USER_ACCESS: "PowerUserAccess",
  READON_ONLY_ACCESS: "ReadOnlyAccess",
  SECURITY_AUDIT: "SecurityAudit",
  SUPPORT_USER: "SupportUser",
  SYSTEMK_ADMINISTRATOR: "SystemAdministrator",
  VIEW_ONLY_ACCESS: "ViewOnlyAccess",
} as const;
