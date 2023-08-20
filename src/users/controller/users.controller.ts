import { FileInterceptor } from '@nestjs/platform-express';
import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { EasyCookBaseController } from 'src/shared/base/controller/base.controller';
import { User } from '../entities/user.entity';
import { UsersService } from '../provider/users/users.service';
import { CreateUserDto } from '../interfaces/create-user.dto';
import { ConfirmEmailService } from 'src/confirm-email/provider/confirm-email.service';
@Controller('users')
export class UsersController extends EasyCookBaseController<User> {
    constructor(service: UsersService, private emailService: ConfirmEmailService) {
        super(service);
    }

    // route pour inscrire un utilisateur
    @Post()
    async create(@Body() dto: CreateUserDto): Promise<User | HttpException> {
        const createdUserOrException = await this.service.create(dto);

        if (createdUserOrException instanceof HttpException) {
            throw createdUserOrException; // Renvoie l'exception
        }
        // Arrivé ici, l'instance devrait être un User
        const createdUser = createdUserOrException;

        await this.emailService.sendConfirmationEmail(createdUser.email, createdUser.nickname);
        return createdUser;
    }
    catch(error) {
        throw new HttpException("Erreur lors de la création de l'utilisateur", HttpStatus.BAD_REQUEST);
    }

    // route pour obtenir les données d'un utilisateur sur base de son id
    @Get(':id')
    findUserById(@Param('id') id: string): Promise<User | HttpException> {
        return this.service.findOne(id);
    }
}
