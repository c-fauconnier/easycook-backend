import { Body, Controller, Get, HttpException, Param, Post, Query, Request, UseGuards } from '@nestjs/common';
import { EasyCookBaseController } from '../../../shared/base/controller/base.controller';
import { Recipe } from '../../entities/recipe.entity';
import { RecipesService } from '../../provider/recipes/recipes.service';
import { ErrorResponse } from '../../../shared/models/error-response';
import { FavoriteRecipe } from 'src/recipes/entities/favorite-recipe.entity';
import { AuthGuard } from 'src/auth/auth/auth.guard';
import { DeleteResult } from 'typeorm';

@Controller('recipes')
export class RecipesController extends EasyCookBaseController<Recipe> {
    constructor(service: RecipesService) {
        super(service);
    }

    @Get()
    findAll(): Promise<Recipe[] | HttpException> {
        return this.service.findAll();
    }

    // route pour obtenir une pagination avec un nombre d'éléments à afficher
    @Get('index')
    getItems(@Query('page') page: number, @Query('limit') limit: number) {
        return (this.service as RecipesService).getRecipesPerPage(page, limit);
    }

    @UseGuards(AuthGuard)
    @Post('favorites')
    addToFavorite(@Body() body: { id: string }, @Request() req): Promise<FavoriteRecipe | HttpException> {
        return (this.service as RecipesService).addToFavorites(req.user, body.id);
    }

    @UseGuards(AuthGuard)
    @Post('deleteFavorite')
    deleteFromMyFavorites(@Body() body: { id: string }, @Request() req): Promise<DeleteResult> {
        return (this.service as RecipesService).deleteFromMyFavorites(req.user, body.id);
    }

    //Override sans le guard pour les requêtes qui sont publiques
    @Get(':id')
    findOne(@Param('id') id: string): Promise<Recipe | HttpException> {
        return this.service.findOne(id);
    }

    @UseGuards(AuthGuard)
    @Get('favorites/isfav/:id')
    isFavorite(@Param('id') id: string, @Request() req): Promise<boolean> {
        return (this.service as RecipesService).isInMyFavorites(id, req.user);
    }
}
