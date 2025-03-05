import { UserRole } from '../entities/user.entity';

export interface JwtPayload {
  sub: string;
  username: string;
  role: UserRole;
}