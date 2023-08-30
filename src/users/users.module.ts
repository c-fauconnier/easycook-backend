import { Module } from '@nestjs/common';
import { UsersController } from './controller/users.controller';
import { UsersService } from './provider/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Restriction } from './entities/restriction.entity';
import { Lecture } from '../lecture/entities/lecture.entity';
import { ConfirmEmailModule } from 'src/confirm-email/confirm-email.module';
import { FavoriteRecipe } from 'src/recipes/entities/favorite-recipe.entity';
import { FavoriteLecture } from 'src/lecture/entities/favorite-lecture.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User, Restriction, Lecture, FavoriteRecipe, FavoriteLecture]), ConfirmEmailModule],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService],
})
export class UsersModule {}
