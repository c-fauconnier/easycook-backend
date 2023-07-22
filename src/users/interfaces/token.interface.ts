import { Role } from '../../shared/enums/role.enum';

export interface Token {
    id: string;
    isRestricted: boolean;
    role: Role;
}
