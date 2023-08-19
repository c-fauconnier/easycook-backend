import { User } from 'src/users/entities/user.entity';
import { HttpException } from '@nestjs/common';

export function isUser(response: User | HttpException): response is User {
    return response instanceof User;
}
