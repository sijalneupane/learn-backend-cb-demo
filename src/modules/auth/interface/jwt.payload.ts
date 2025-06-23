import { Role } from '../enum/role.enum';

export interface JwtPayload {
  sub: string; // User ID
  username: string;
  role: Role;
  email: string;
}
