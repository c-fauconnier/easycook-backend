import { Module } from '@nestjs/common';
import { RecipesController } from './controller/recipes/recipes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recipe } from './entities/recipe.entity';
import { Step } from './entities/step.entity';
import { RecipeIngredient } from './entities/recipe-ingredient.entity';
import { Ingredient } from './entities/ingredient.entity';
import { RecipesService } from './provider/recipes/recipes.service';
import { IngredientsController } from './controller/ingredients/ingredients.controller';
import { IngredientsService } from './provider/ingredients/ingredients.service';
import { Comment } from './entities/comment.entity';

@Module({
    controllers: [RecipesController, IngredientsController],
    providers: [RecipesService, IngredientsService],
    imports: [TypeOrmModule.forFeature([Recipe, Step, RecipeIngredient, Ingredient, Comment])],
})
export class RecipesModule {}
