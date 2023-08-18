import { FileInterceptor } from '@nestjs/platform-express';
import { Body, Controller, Get, HttpException, Param, Post, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { EasyCookBaseController } from 'src/shared/base/controller/base.controller';
import { User } from '../entities/user.entity';
import { UsersService } from '../provider/users/users.service';
import { ErrorResponse } from '../../shared/models/error-response';
import { CreateUserDto } from '../interfaces/create-user.dto';
import { ConfirmEmailService } from 'src/confirm-email/provider/confirm-email.service';
import { isUser } from 'src/shared/validators/user.validator';

@Controller('users')
export class UsersController extends EasyCookBaseController<User> {
    constructor(service: UsersService, private emailService: ConfirmEmailService) {
        super(service);
    }

    // route pour inscrire un utilisateur
    @Post()
    async create(@Body() dto: CreateUserDto): Promise<User | HttpException> {
        const createdUser = await this.service.create(dto);
        // if (isUser(createdUser)) {
        //     await this.emailService.sendConfirmationEmail(createdUser.email, createdUser.nickname);
        // }
        return createdUser;
    }

    // route pour obtenir les données d'un utilisateur sur base de son id
    @Get(':id')
    findUserById(@Param('id') id: string): Promise<User | HttpException> {
        return this.service.findOne(id);
    }
}
