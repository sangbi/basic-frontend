export const queryKeys = {
  users: (params: unknown) => ["users", params],
  infoUser: (userId: string) => ["user", userId],
  codes: (params: unknown) => ["codes", params],
  summary: () => ["summary"],
};
