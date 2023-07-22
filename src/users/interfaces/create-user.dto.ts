import { isEmail } from 'class-validator';
import { Role } from 'src/shared/enums/role.enum';

export class CreateUserDto {
    name: string;
    surname: string;
    nickname: string;
    password: string;
    email: string;
    role?: Role;

    constructor() {
        this.email = '';
    }
}
