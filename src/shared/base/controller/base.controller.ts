import { DeleteResult, UpdateResult } from 'typeorm';
import { ErrorResponse } from '../../models/error-response';
import { EasyCookBaseEntity } from '../entity/base.entity';
import { EasyCookBaseService } from '../provider/base.service';
import { Controller, Get, Post, Delete, Put, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '../../../auth/auth/auth.guard';

export class EasyCookBaseController<T extends EasyCookBaseEntity> {
    constructor(public service: EasyCookBaseService<T>) {}

    @UseGuards(AuthGuard)
    @Post()
    create(@Body() dto: any, @Request() req: any): Promise<T | ErrorResponse[]> {
        return this.service.create(dto, req.user);
    }

    @UseGuards(AuthGuard)
    @Get()
    findAll(@Request() req: any): Promise<T[] | ErrorResponse[]> {
        return this.service.findAll(req.user);
    }

    @UseGuards(AuthGuard)
    @Get(':id')
    findOne(@Param('id') id: string, @Request() req: any): Promise<T | ErrorResponse[]> {
        return this.service.findOne(id, req.user);
    }

    @UseGuards(AuthGuard)
    @Put(':id')
    update(@Param('id') id: string, @Body() dto: any, @Request() req: any): Promise<UpdateResult | ErrorResponse[]> {
        return this.service.update(id, dto, req.user);
    }

    @UseGuards(AuthGuard)
    @Delete(':id')
    delete(@Param('id') id: string, @Request() req: any): Promise<DeleteResult | ErrorResponse[]> {
        return this.service.delete(id, req.user);
    }
}
