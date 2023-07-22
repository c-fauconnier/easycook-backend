import { Controller, Get } from '@nestjs/common';
import { EasyCookBaseController } from '../../../shared/base/controller/base.controller';
import { Recipe } from '../../entities/recipe.entity';
import { RecipesService } from '../../provider/recipes/recipes.service';

@Controller('recipes')
export class RecipesController extends EasyCookBaseController<Recipe> {
    constructor(service: RecipesService) {
        super(service);
    }
}
