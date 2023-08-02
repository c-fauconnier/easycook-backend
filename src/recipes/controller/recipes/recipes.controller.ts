import { Controller, Get } from '@nestjs/common';
import { EasyCookBaseController } from '../../../shared/base/controller/base.controller';
import { Recipe } from '../../entities/recipe.entity';
import { RecipesService } from '../../provider/recipes/recipes.service';
import { ErrorResponse } from '../../../shared/models/error-response';

@Controller('recipes')
export class RecipesController extends EasyCookBaseController<Recipe> {
    constructor(service: RecipesService) {
        super(service);
    }

    //Override sans le guard pour les requêtes qui sont publiques
    @Get()
    findAll(): Promise<Recipe[] | ErrorResponse[]> {
        return this.service.findAll();
    }
}
