import { FavoriteLecture } from 'src/lecture/entities/favorite-lecture.entity';
import { AuthGuard } from '../../../auth/auth/auth.guard';
import { Lecture } from '../../entities/lecture.entity';
import { LecturesService } from '../../providers/lectures/lectures.service';
import { EasyCookBaseController } from './../../../shared/base/controller/base.controller';
import { Body, Controller, Get, HttpException, Param, Post, Query, Request, UseGuards } from '@nestjs/common';
import { DeleteResult } from 'typeorm';

@Controller('lectures')
export class LecturesController extends EasyCookBaseController<Lecture> {
    constructor(service: LecturesService) {
        super(service);
    }

    @Get('title/:title')
    isTitleAlreadyTaken(@Param('title') title: string): Promise<boolean> {
        return (this.service as LecturesService).verifyTitle(title);
    }

    // route pour obtenir une pagination avec un nombre d'éléments à afficher
    @Get('index')
    getItems(@Query('page') page: number, @Query('limit') limit: number) {
        return (this.service as LecturesService).getLecturesPerPage(page, limit);
    }

    @UseGuards(AuthGuard)
    @Post('favorites')
    addToFavorite(@Body() body: { id: string }, @Request() req): Promise<FavoriteLecture | HttpException> {
        return (this.service as LecturesService).addToFavorites(req.user, body.id);
    }

    @UseGuards(AuthGuard)
    @Post('deleteFavorite')
    deleteFromMyFavorites(@Body() body: { id: string }, @Request() req): Promise<DeleteResult> {
        return (this.service as LecturesService).deleteFromMyFavorites(req.user, body.id);
    }

    //Override sans le guard pour les requêtes qui sont publiques
    @Get(':id')
    findOne(@Param('id') id: string): Promise<Lecture | HttpException> {
        return this.service.findOne(id);
    }

    @UseGuards(AuthGuard)
    @Get('favorites/isfav/:id')
    isFavorite(@Param('id') id: string, @Request() req): Promise<boolean> {
        return (this.service as LecturesService).isInMyFavorites(id, req.user);
    }
}
