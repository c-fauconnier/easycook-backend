import { FileInterceptor } from '@nestjs/platform-express';
import {
    Body,
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Param,
    Post,
    Put,
    Request,
    UseGuards,
    UseInterceptors,
    ValidationPipe,
} from '@nestjs/common';
import { EasyCookBaseController } from 'src/shared/base/controller/base.controller';
import { User } from '../entities/user.entity';
import { UsersService } from '../provider/users/users.service';
import { CreateUserDto } from '../interfaces/create-user.dto';
import { ConfirmEmailService } from 'src/confirm-email/provider/confirm-email.service';
import { AuthGuard } from 'src/auth/auth/auth.guard';
import { FavoriteRecipe } from 'src/recipes/entities/favorite-recipe.entity';
import { FavoriteLecture } from 'src/lecture/entities/favorite-lecture.entity';
import { Recipe } from 'src/recipes/entities/recipe.entity';
import { UpdateResult } from 'typeorm';
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

    @UseGuards(AuthGuard)
    @Get('email')
    async sendConfirmationEmail(@Request() req: any): Promise<void> {
        const user = await this.findOne(req.user.id, req);
        this.emailService.sendConfirmationEmail((user as User).email, (user as User).nickname);
        return;
        // return this.emailService.sendConfirmationEmail(email, nickname);
    }

    @UseGuards(AuthGuard)
    @Get('recipes')
    async getUserRecipes(@Request() req: any): Promise<Recipe[]> {
        return (this.service as UsersService).getUserRecipes(req.user.id);
    }

    @UseGuards(AuthGuard)
    @Get('favoriteRecipes')
    async getUserFavoriteRecipes(@Request() req: any): Promise<FavoriteRecipe[]> {
        return (this.service as UsersService).getUserFavoriteRecipes(req.user.id);
    }

    @UseGuards(AuthGuard)
    @Get('favoriteLectures')
    async getUserFavoriteLectures(@Request() req: any): Promise<FavoriteLecture[]> {
        return (this.service as UsersService).getUserFavoriteLectures(req.user.id);
    }

    @UseGuards(AuthGuard)
    @Put('password/:id')
    async updatePassword(@Body('password') password: string, @Request() req: any): Promise<UpdateResult> {
        return (this.service as UsersService).updatePassword(password, req.user);
    }

    @UseGuards(AuthGuard)
    @Put(':id')
    async updateProfile(@Body() profile: any, @Request() req: any): Promise<UpdateResult> {
        return (this.service as UsersService).updateProfile(profile, req.user);
    }

    // route pour obtenir les données d'un utilisateur sur base de son id
    @Get(':id')
    async findUserById(@Param('id') id: string): Promise<User | HttpException> {
        return (this.service as UsersService).findOne(id);
    }
}
