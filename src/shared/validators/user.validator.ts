import { User } from 'src/users/entities/user.entity';
import { ErrorResponse } from '../models/error-response';

export function isUser(response: User | ErrorResponse[]): response is User {
    return response instanceof User;
}
