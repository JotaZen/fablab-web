export type User = {
  id: string | number;
  username?: string;
  email?: string;
  roles?: string[];
  permissions?: string[];
  [key: string]: unknown;
};

export type AuthResult = { jwt: string; user: User };
