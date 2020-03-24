export interface User {
  username: string,
  firstName?: string,
  lastName?: string,
  superuser?: boolean
}

export const NULL_USER = {
  username: "",
};
