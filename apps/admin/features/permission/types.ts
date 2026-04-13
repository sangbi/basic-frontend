export type MenuPermission = {
  menuPath: string | null;
  apiPath: string | null;
  canRead: string;
  canCreate: string;
  canUpdate: string;
  canDelete: string;
};
