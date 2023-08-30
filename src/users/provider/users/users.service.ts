import { BadRequestException, Catch, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EasyCookBaseService } from '../../../shared/base/provider/base.service';
import { User } from '../../entities/user.entity';
import { Token } from 'src/users/interfaces/token.interface';
import { CreateUserDto } from 'src/users/interfaces/create-user.dto';
import { ErrorResponse } from 'src/shared/models/error-response';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Role } from 'src/shared/enums/role.enum';
import { FavoriteRecipe } from 'src/recipes/entities/favorite-recipe.entity';
import { FavoriteLecture } from 'src/lecture/entities/favorite-lecture.entity';
import { Recipe } from 'src/recipes/entities/recipe.entity';
import { ConfirmEmailService } from 'src/confirm-email/provider/confirm-email.service';

const argon2 = require('argon2');

@Injectable()
export class UsersService extends EasyCookBaseService<User> {
    constructor(
        @InjectRepository(User) private repo: Repository<User>,
        @InjectRepository(FavoriteRecipe) private favoritesRecipesRepo: Repository<FavoriteRecipe>,
        @InjectRepository(FavoriteLecture) private favoritesLecturesRepo: Repository<FavoriteLecture>,
        private emailService: ConfirmEmailService
    ) {
        super(repo);
    }

    canCreate(dto: CreateUserDto, user?: Token): boolean {
        return true;
    }

    async canSignUp(dto: CreateUserDto, user?: Token): Promise<boolean> {
        this.errors = [];
        const emailRegex = new RegExp('[a-z0-9]+@[a-z]+.[a-z]{2,3}');

        if (!emailRegex.test(dto.email)) {
            console.log('invalid');

            this.generateNewError(`L'adresse email est invalide.`, 'email');
        }

        const isEmailUnique = await this.verifyEmailUnicity(dto.email);

        if (!isEmailUnique) {
            this.generateNewError(`L'adresse email est déjà prise.`, 'email');
        }
        const isNicknameUnique = await this.verifyNicknameUnicity(dto.nickname);

        if (!isNicknameUnique) {
            this.generateNewError(`Le pseudonyme est déjà pris.`, 'nickname');
        }

        return this.hasError();
    }
    async create(dto: CreateUserDto, user?: Token): Promise<User | HttpException> {
        try {
            if (await this.canSignUp(dto, user)) {
                const hash = await (await argon2).hash(dto.password);
                dto.password = hash;
                return this.repo.save(dto);
            } else {
                throw new HttpException({ errors: this.errors }, HttpStatus.BAD_REQUEST);
            }
        } catch (err) {
            throw err;
        }
    }

    canAccess(user?: Token): boolean {
        this.errors = [];
        return true;
    }

    canAccessToAll(user?: Token): boolean {
        this.errors = [];

        if (user.role !== Role.Admin) {
            this.generateNewError(`Vous ne pouvez pas accéder à ce service`, `user`);
        }
        return this.hasError();
    }

    canUpdate(user?: Token): boolean {
        this.errors = [];
        return true;
    }

    async findOne(userId: string): Promise<User | HttpException> {
        try {
            this.errors = [];

            const user = await this.repo
                .createQueryBuilder('user')
                .leftJoinAndSelect('user.favoriteRecipes', 'favoriteRecipe')
                .leftJoinAndSelect('favoriteRecipe.recipe', 'recipe')
                .leftJoinAndSelect('user.favoriteLectures', 'favoriteLecture')
                .leftJoinAndSelect('favoriteLecture.lecture', 'lecture')
                .leftJoinAndSelect('user.recipes', 'userRecipe')
                .where('user.id = :userId', { userId })
                .orderBy('favoriteRecipe.id', 'DESC') // Tri des recettes favorites par ordre décroissant
                .addOrderBy('favoriteLecture.id', 'DESC') // Tri des cours favoris par ordre décroissant
                .addOrderBy('userRecipe.id', 'DESC') // Tri des recettes créées par ordre décroissant
                .getOne();

            if (!user) {
                this.generateNewError(`Impossible de trouver l'utilisateur`, `user`);
                throw new HttpException({ errors: this.errors }, HttpStatus.BAD_REQUEST);
            }
            return user;
        } catch (err) {
            throw err;
        }
    }

    async canDeleteUser(targetId: string, user?: Token): Promise<boolean> {
        try {
            this.errors = [];

            if (!(await this.isUserOrAdmin(user, targetId))) this.generateNewError(`Vous ne pouvez pas supprimer cet utilisateur.`, `user`);

            return this.hasError();
        } catch (err) {
            throw err;
        }
    }

    async delete(id: string, user?: Token): Promise<DeleteResult | HttpException> {
        try {
            if (await this.canDeleteUser(id, user)) {
                return await this.repo.delete(id);
            } else {
                throw new HttpException({ errors: this.errors }, HttpStatus.BAD_REQUEST);
            }
        } catch (err) {
            throw err;
        }
    }

    async verifyLastPassword(pass: string, user: Token): Promise<boolean> {
        try {
            if (pass && user) {
                const connectedUser = await this.repo.findOne({ where: { id: +user.id } });
                const lastPassword = connectedUser.password;
                const matching = !!(await argon2.verify(lastPassword, pass));

                return matching;
            }
        } catch (err) {
            throw err;
        }
    }

    async updatePassword(newPass: string, user: Token): Promise<any> {
        try {
            // const oldPassword = (await this.repo.findOne({ where: { id: +user.id } })).password;
            // const matching = !!(await argon2.verify(oldPassword, newPass));

            // if (matching) {
            //     this.errors = [];
            //     this.generateNewError(`Le mot de passe est identique au précédent`, `password`);
            //     throw new BadRequestException(this.errors, HttpStatus.BAD_REQUEST.toString());
            // } else {
            const userToUpdate = await this.repo.findOne({ where: { id: +user.id } });
            if (user) {
                const hash = await (await argon2).hash(newPass);
                userToUpdate.password = hash;
                return userToUpdate.save();
                //return this.repo.update(+user.id, { password: hash });
            }
            //}
        } catch (err) {
            throw err;
        }
    }

    async updateProfile(dto: any, user: Token): Promise<UpdateResult> {
        try {
            if (dto.email) {
                const userToUpdate = await this.repo.findOne({ where: { id: +user.id } });
                this.repo.update(+user.id, { isEmailVerified: false });
                await this.emailService.sendModificationEmail(userToUpdate.email, userToUpdate.nickname);
            }
            return await this.repo.update(+user.id, dto);
        } catch (err) {
            throw err;
        }
    }

    canDelete(user?: Token): boolean {
        return false;
    }

    async verifyEmailUnicity(email: string): Promise<boolean> {
        const accountWithEmail = await this.repo.findOne({ where: { email: email } });

        return !accountWithEmail ? true : false;
    }

    async verifyNicknameUnicity(nickname: string): Promise<boolean> {
        const accountWithNickname = await this.repo.findOne({ where: { nickname: nickname } });

        return !accountWithNickname ? true : false;
    }

    async findByEmail(email: string): Promise<User> {
        const user = await this.repo.findOne({ where: { email: email } });
        return user;
    }

    async isUserOrAdmin(user: Token, userTargetId: string): Promise<boolean> {
        const target = await this.repo.findOne({ where: { id: +userTargetId } });

        return user.role === Role.Admin || user.id === target.id.toString() ? true : false;
    }
    async getUserRecipes(userId: string): Promise<Recipe[]> {
        const myRecipes = await this.repo.findOne({ where: { id: +userId } });
        return myRecipes.recipes;
    }
    async getUserFavoriteRecipes(userId: string): Promise<FavoriteRecipe[]> {
        const myFavorites = await this.favoritesRecipesRepo.find({ where: { user: { id: +userId } }, relations: ['recipe'] });
        return myFavorites;
    }

    async getUserFavoriteLectures(userId: string): Promise<FavoriteLecture[]> {
        const myFavorites = await this.favoritesLecturesRepo.find({ where: { user: { id: +userId } }, relations: ['lecture'] });
        return myFavorites;
    }
}
