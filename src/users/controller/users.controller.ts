import { FileInterceptor } from '@nestjs/platform-express';
import { Body, Controller, Get, Param, Post, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { EasyCookBaseController } from 'src/shared/base/controller/base.controller';
import { User } from '../entities/user.entity';
import { UsersService } from '../provider/users/users.service';
import { ErrorResponse } from '../../shared/models/error-response';
import { CreateUserDto } from '../interfaces/create-user.dto';
import { ConfirmEmailService } from 'src/confirm-email/service/confirm-email.service';
import { isUser } from 'src/shared/validators/user.validator';

@Controller('users')
export class UsersController extends EasyCookBaseController<User> {
    constructor(service: UsersService, private emailService: ConfirmEmailService) {
        super(service);
    }

    // route to register a new user
    @Post()
    async create(@Body() dto: CreateUserDto): Promise<User | ErrorResponse[]> {
        const createdUser = await this.service.create(dto);
        if (isUser(createdUser)) {
            await this.emailService.sendConfirmationEmail(createdUser.email, createdUser.nickname);
        }
        return createdUser;
    }

    // route to get user infos based on its id
    @Get(':id')
    findUserById(@Param('id') id: string): Promise<User | ErrorResponse[]> {
        return this.service.findOne(id);
    }
}
