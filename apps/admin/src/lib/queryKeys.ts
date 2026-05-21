export const queryKeys = {
  users: (params: unknown) => ["users", params],
  infoUser: (userId: string) => ["user", userId],
  codes: (params: unknown) => ["codes", params],
  notices: (title: unknown) => ["notices", title],
  resource: (title: unknown) => ["resource", title],
  summary: () => ["summary"],
};
