import { Controller, Get, HttpException, Query } from '@nestjs/common';
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
    findAll(): Promise<Recipe[] | HttpException> {
        return this.service.findAll();
    }

    // @Get('page')
    // getRecipesPerPage(
    //     @Query('nbr') number: number,
    //     @Query('start') indexStart: number,
    //     @Query('end') indexEnd: number
    // ): Promise<Recipe[] | ErrorResponse[]> {
    //     return (this.service as RecipesService).getRecipesPerPage(number, indexStart, indexEnd);
    // }

    // route pour obtenir une pagination avec un nombre d'éléments à afficher
    @Get('items')
    getItems(@Query('page') page: number, @Query('limit') limit: number) {
        return (this.service as RecipesService).getRecipesPerPage(page, limit);
    }
}
