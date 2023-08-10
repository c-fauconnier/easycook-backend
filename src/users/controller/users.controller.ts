import { FileInterceptor } from '@nestjs/platform-express';
import { Body, Controller, Get, Post, UseInterceptors } from '@nestjs/common';
import { EasyCookBaseController } from 'src/shared/base/controller/base.controller';
import { User } from '../entities/user.entity';
import { UsersService } from '../provider/users/users.service';
import { ErrorResponse } from '../../shared/models/error-response';
import { CreateUserDto } from '../interfaces/create-user.dto';

@Controller('users')
export class UsersController extends EasyCookBaseController<User> {
    constructor(service: UsersService) {
        super(service);
    }

    // route to register a new user
    @Post()
    create(@Body() dto: CreateUserDto): Promise<User | ErrorResponse[]> {
        return this.service.create(dto);
    }
}
