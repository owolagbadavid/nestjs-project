import { SetMetadata } from '@nestjs/common';
import { Role } from '../types/roles.enum';

export const Roles = (role: Role) => SetMetadata('role', role);
