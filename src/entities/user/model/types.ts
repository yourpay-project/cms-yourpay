/**
 * User entity as returned by the users list API.
 */
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status?: string;
}

