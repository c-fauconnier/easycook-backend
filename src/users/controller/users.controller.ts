import { Controller } from '@nestjs/common';
import { EasyCookBaseController } from 'src/shared/base/controller/base.controller';
import { User } from '../entities/user.entity';
import { UsersService } from '../provider/users/users.service';

@Controller('users')
export class UsersController extends EasyCookBaseController<User> {
    constructor(service: UsersService) {
        super(service);
    }
}
