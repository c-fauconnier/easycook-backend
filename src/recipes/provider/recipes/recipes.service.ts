import { ErrorHttpStatusCode } from '@nestjs/common/utils/http-error-by-code.util';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpStatus, Injectable } from '@nestjs/common';
import { DataSource, In, Like, Repository } from 'typeorm';
import { Recipe } from '../../entities/recipe.entity';
import { EasyCookBaseService } from '../../../shared/base/provider/base.service';
import { ErrorResponse } from '../../../shared/models/error-response';
import { Ingredient } from '../../entities/ingredient.entity';
import { CreateRecipeDto } from '../../dtos/create-recipe.dto';
import { Step } from '../../entities/step.entity';
import { RecipeIngredient } from '../../entities/recipe-ingredient.entity';
import { Token } from '../../../users/interfaces/token.interface';

@Injectable()
export class RecipesService extends EasyCookBaseService<Recipe> {
    constructor(
        @InjectRepository(Recipe) private repo: Repository<Recipe>,
        @InjectRepository(Ingredient) private ingredientsRepo: Repository<Ingredient>,
        @InjectRepository(RecipeIngredient) private riRepo: Repository<RecipeIngredient>,
        @InjectRepository(Step) private stepsRepo: Repository<Step>,
        private dataSource: DataSource
    ) {
        super(repo);
    }

    canCreate(dto: CreateRecipeDto, user?: Token): boolean {
        this.errors = [];

        //! UNCOMMENT ONCE USERS ARE CREATED
        // if (user.isRestricted) {
        //     const error = new ErrorResponse(`Vous ne pouvez pas créer de recette car vous êtes restreint`, 'user');
        //     this.errors.push(error);
        //     return false;
        // }

        if (dto.ingredients.length < 1) {
            const error = new ErrorResponse(`La recette doit avoir au moins un ingrédient`, 'ingredients');
            this.errors.push(error);
            return false;
        }

        if (dto.steps.length < 1) {
            const error = new ErrorResponse(`La recette doit avoir au moins une étape`, 'steps');
            this.errors.push(error);
            return false;
        }

        for (const step of dto.steps) {
            if (step.duration <= 0) {
                const error = new ErrorResponse(`L'étape doit avoir une durée supérieure à 0`, 'steps');
                this.errors.push(error);
                return false;
            }

            if (step.number < 1) {
                const error = new ErrorResponse(`L'étape doit avoir un numéro supérieur à 0`, 'steps');
                this.errors.push(error);
                return false;
            }
        }

        if (dto.difficulty > 5 || dto.difficulty < 0) {
            const error = new ErrorResponse(`La difficulté doit être plus grande ou égale à 0 et inférieure ou égale à 5`, 'difficulty');
            this.errors.push(error);
            return false;
        }

        if (dto.likes !== 0) {
            const error = new ErrorResponse(`Une recette ne peut commencer qu'avec 0 likes`, 'likes');
            this.errors.push(error);
            return false;
        }

        return true;
    }
    async create(dto: CreateRecipeDto, user?: any): Promise<Recipe | ErrorResponse[]> {
        try {
            if (this.canCreate(dto, user)) {
                //On crée la base de la recette
                const recipe = new Recipe();
                recipe.title = dto.title;
                recipe.description = dto.description;
                recipe.difficulty = dto.difficulty;
                recipe.likes = dto.likes;
                recipe.steps = [];
                recipe.ingredients = [];
                //On sauvegarde dans la db
                let savedRecipe = await this.repo.save(recipe);
                //On créée les étapes
                let newSteps: Step[] = [];
                for (const step of dto.steps) {
                    let stepEntity = new Step();
                    stepEntity.explanation = step.explanation;
                    stepEntity.title = step.title;
                    stepEntity.duration = step.duration;
                    stepEntity.number = step.number;
                    await this.stepsRepo.save(stepEntity);
                    newSteps.push(stepEntity);
                }
                savedRecipe.steps = newSteps;
                //Pour chaque ingrédient on va récupérer son entité correspondante
                //Il faut donc que les ingrédients existent déjà
                //On va créer un record dans la table de liaison, elle lie un ingrédient à une recette
                let newIngredients: RecipeIngredient[] = [];
                for (const ingredient of dto.ingredients) {
                    const foundIngredient = await this.ingredientsRepo.findOne({
                        where: { name: ingredient.name },
                        relations: ['recipes'],
                    });
                    if (foundIngredient) {
                        let riEntity = new RecipeIngredient();
                        riEntity.quantity = ingredient.quantity;
                        riEntity.unit = ingredient.unit;
                        const savedRiEntity = await this.riRepo.save(riEntity);
                        foundIngredient.recipes.push(savedRiEntity);
                        await this.ingredientsRepo.save(foundIngredient);
                        newIngredients.push(riEntity);
                    } else {
                        const error = new ErrorResponse(`L'ingrédient ${ingredient.name} n'existe pas`, 'ingredients');
                        this.errors.push(error);
                        return this.errors;
                    }
                }
                //
                //
                savedRecipe.ingredients = newIngredients;
                //Maintenant qu'on a tous les champs de rempli on sauvegarde la création complète
                return await this.repo.save(savedRecipe);
            } else {
                return this.errors;
            }
        } catch (error) {
            throw error;
        }
    }

    canAccess(user?: Token): boolean {
        this.errors = [];

        return true;
    }

    override async findOne(id: number, user?: Token): Promise<Recipe | ErrorResponse[]> {
        try {
            if (this.canAccess(user)) {
                return await this.repo.findOne({ where: { id: id }, relations: ['user'] });
            } else {
                return this.errors;
            }
        } catch (error) {
            throw error;
        }
    }

    canAccessToAll(user?: Token): boolean {
        this.errors = [];

        return true;
    }

    canDelete(user?: Token): boolean {
        this.errors = [];

        return true;
    }

    canUpdate(user?: Token): boolean {
        this.errors = [];

        return true;
    }
}
