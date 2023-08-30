import { ErrorHttpStatusCode } from '@nestjs/common/utils/http-error-by-code.util';
import { InjectRepository } from '@nestjs/typeorm';
import { Catch, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { DataSource, DeleteResult, In, Like, Repository } from 'typeorm';
import { Recipe } from '../../entities/recipe.entity';
import { EasyCookBaseService } from '../../../shared/base/provider/base.service';
import { ErrorResponse } from '../../../shared/models/error-response';
import { Ingredient } from '../../entities/ingredient.entity';
import { CreateRecipeDto } from '../../dtos/create-recipe.dto';
import { Step } from '../../entities/step.entity';
import { RecipeIngredient } from '../../entities/recipe-ingredient.entity';
import { Token } from '../../../users/interfaces/token.interface';
import { FavoriteRecipe } from 'src/recipes/entities/favorite-recipe.entity';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/shared/enums/role.enum';

@Injectable()
export class RecipesService extends EasyCookBaseService<Recipe> {
    constructor(
        @InjectRepository(Recipe) private repo: Repository<Recipe>,
        @InjectRepository(User) private usersRepo: Repository<User>,
        @InjectRepository(Ingredient) private ingredientsRepo: Repository<Ingredient>,
        @InjectRepository(RecipeIngredient) private riRepo: Repository<RecipeIngredient>,
        @InjectRepository(Step) private stepsRepo: Repository<Step>,
        @InjectRepository(FavoriteRecipe) private favoritesRecipesRepo: Repository<FavoriteRecipe>,
        private dataSource: DataSource
    ) {
        super(repo);
    }

    canCreate(dto: CreateRecipeDto, user?: Token): boolean {
        this.errors = [];

        //! UNCOMMENT ONCE USERS ARE CREATED
        if (user.isRestricted) {
            this.generateNewError(`Vous ne pouvez pas créer de recette car vous êtes restreint`, 'user');
        }

        // if (!dto.ingredients || dto.ingredients.length < 1) {
        //     this.generateNewError(`La recette doit avoir au moins un ingrédient`, 'ingredients');
        // } ! A reutiliser lorsque les ingrédients sont prêts dans le front

        if (dto.steps.length < 1) {
            this.generateNewError(`La recette doit avoir au moins une étape`, 'steps');
        }

        for (const step of dto.steps) {
            // if (!step.duration || step.duration <= 0) {
            //     this.generateNewError(`L'étape doit avoir une durée supérieure à 0 ( Etape ${step.index})`, 'steps');
            // } ! A modifier si les étapes intègrent une notion de durée !

            if (step.index < 1) {
                this.generateNewError(`L'étape doit avoir un numéro supérieur à 0 (Etape ${step.index})`, 'steps');
            }
        }

        if (dto.difficulty > 5 || dto.difficulty < 0) {
            this.generateNewError(`La difficulté doit être plus grande ou égale à 0 et inférieure ou égale à 5`, 'difficulty');
        }

        if (dto.likes !== 0 && dto.likes !== null) {
            this.generateNewError(`Une recette ne peut commencer qu'avec 0 likes`, 'likes');
        }

        if (dto.duration === 0) {
            this.generateNewError(`Une recette doit avoir une durée`, 'duration');
        }

        return this.hasError();
    }
    async create(dto: CreateRecipeDto, user?: any): Promise<Recipe | HttpException> {
        try {
            if (this.canCreate(dto, user)) {
                //On crée la base de la recette
                const recipe = new Recipe();
                recipe.title = dto.title;
                recipe.description = dto.description;
                recipe.difficulty = dto.difficulty;
                recipe.likes = dto.likes;
                recipe.steps = [];
                recipe.media = dto.media;
                recipe.duration = dto.duration;
                recipe.user = user.id;
                //recipe.ingredients = [];
                //On sauvegarde dans la db
                let savedRecipe = await this.repo.save(recipe);
                //On créée les étapes
                let newSteps: Step[] = [];

                for (const step of dto.steps) {
                    let stepEntity = new Step();
                    stepEntity.explanation = step.explanation;
                    stepEntity.title = step.title;
                    //stepEntity.duration = step.duration;
                    stepEntity.index = step.index;
                    await this.stepsRepo.save(stepEntity);
                    newSteps.push(stepEntity);
                }
                savedRecipe.steps = newSteps;
                //Pour chaque ingrédient on va récupérer son entité correspondante
                //Il faut donc que les ingrédients existent déjà
                //On va créer un record dans la table de liaison, elle lie un ingrédient à une recette
                //let newIngredients: RecipeIngredient[] = [];

                // for (const ingredient of dto.ingredients) {
                //     const foundIngredient = await this.ingredientsRepo.findOne({
                //         where: { name: ingredient.name },
                //         relations: ['recipes'],
                //     });

                //     if (foundIngredient) {
                //         let riEntity = new RecipeIngredient();
                //         riEntity.quantity = ingredient.quantity;
                //         riEntity.unit = ingredient.unit;
                //         const savedRiEntity = await this.riRepo.save(riEntity);
                //         foundIngredient.recipes.push(savedRiEntity);
                //         await this.ingredientsRepo.save(foundIngredient);
                //         newIngredients.push(riEntity);
                //     } else {
                //         this.generateNewError(`L'ingrédient ${ingredient.name} n'existe pas`, 'ingredients');

                //         throw new HttpException({ errors: this.errors }, HttpStatus.BAD_REQUEST);
                //     }
                // }
                //
                //
                //savedRecipe.ingredients = newIngredients;
                //Maintenant qu'on a tous les champs de rempli on sauvegarde la création complète
                return await this.repo.save(savedRecipe);
            } else {
                throw new HttpException({ errors: this.errors }, HttpStatus.BAD_REQUEST);
            }
        } catch (error) {
            throw error;
        }
    }

    canAccess(user?: Token): boolean {
        this.errors = [];

        return true;
    }

    override async findOne(id: number, user?: Token): Promise<Recipe | HttpException> {
        try {
            if (this.canAccess(user)) {
                return await this.repo.findOne({ where: { id: id }, relations: ['user'] });
            } else {
                throw new HttpException({ errors: this.errors }, HttpStatus.BAD_REQUEST);
            }
        } catch (error) {
            throw error;
        }
    }

    canAccessToAll(user?: Token): boolean {
        this.errors = [];

        return this.hasError();
    }

    async canDeleteRecipe(targetId: string, user?: Token): Promise<boolean> {
        try {
            this.errors = [];

            if (!(await this.isUserOrAdmin(user, targetId))) this.generateNewError(`Vous ne pouvez pas supprimer cette recette.`, `user`);

            return this.hasError();
        } catch (err) {
            throw err;
        }
    }

    async isUserOrAdmin(user: Token, userTargetId: string): Promise<boolean> {
        const target = await this.repo.findOne({ where: { id: +userTargetId }, relations: ['user'] });

        return user.role === Role.Admin || user.id === target.user.id.toString() ? true : false;
    }

    async delete(id: string, user?: Token): Promise<DeleteResult | HttpException> {
        try {
            if (await this.canDeleteRecipe(id, user)) {
                return await this.repo.delete(id);
            } else {
                throw new HttpException({ errors: this.errors }, HttpStatus.BAD_REQUEST);
            }
        } catch (err) {
            throw err;
        }
    }

    canDelete(user?: Token): boolean {
        this.errors = [];

        return this.hasError();
    }

    canUpdate(user?: Token): boolean {
        this.errors = [];

        return this.hasError();
    }

    async getRecipesPerPage(page: number, limit: number): Promise<object> {
        const offset = (page - 1) * limit;
        const [items, totalCount] = await this.repo.findAndCount({
            skip: offset,
            take: limit,
            where: { isValid: true },
        });

        const totalPages = Math.ceil(totalCount / limit);
        return { items, totalCount, totalPages };
    }

    async canAddToFavorites(user: Token, id: string): Promise<boolean> {
        try {
            const recipeToFav = !!(await this.repo.findOne({ where: { id: +id } }));

            if (!recipeToFav) {
                this.generateNewError(`La recette n'existe pas`, `recipe`);
            }
            const alreadyFavorite = await this.favoritesRecipesRepo.find({ where: { user: { id: +user.id }, recipe: { id: +id } } });

            if (alreadyFavorite.length) {
                this.generateNewError(`La recette est déjà dans les favoris`, `none`);
            }
            return this.hasError();
        } catch (err) {
            throw err;
        }
    }

    async isInMyFavorites(id: string, user: Token): Promise<boolean> {
        try {
            const myFavorites = await this.favoritesRecipesRepo.find({ where: { user: { id: +user.id } }, relations: ['recipe'] });
            const isFavorite = myFavorites.find((fav) => fav.recipe.id === +id);
            return isFavorite ? true : false;
        } catch (err) {
            throw err;
        }
    }

    async deleteFromMyFavorites(user: Token, id: string): Promise<DeleteResult> {
        try {
            const fav = await this.favoritesRecipesRepo.findOne({ where: { user: { id: +user.id }, recipe: { id: +id } } });
            return this.favoritesRecipesRepo.delete(fav.id);
        } catch (err) {
            throw err;
        }
    }

    async addToFavorites(user: Token, id: string): Promise<FavoriteRecipe | HttpException> {
        try {
            if (await this.canAddToFavorites(user, id)) {
                const userToAdd = await this.usersRepo.findOne({ where: { id: +user.id } });
                const recipeToAdd = await this.repo.findOne({ where: { id: +id } });
                const newFavoriteRecipe = new FavoriteRecipe();
                newFavoriteRecipe.user = userToAdd;
                newFavoriteRecipe.recipe = recipeToAdd;

                return await this.favoritesRecipesRepo.save(newFavoriteRecipe);
            } else {
                throw new HttpException({ errors: this.errors }, HttpStatus.BAD_REQUEST);
            }
        } catch (err) {
            throw err;
        }
    }
}
