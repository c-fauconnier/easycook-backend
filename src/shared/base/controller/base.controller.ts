import { DeleteResult, UpdateResult } from 'typeorm';
import { ErrorResponse } from '../../models/error-response';
import { EasyCookBaseEntity } from '../entity/base.entity';
import { EasyCookBaseService } from '../provider/base.service';
import { Controller, Get, Post, Delete, Put, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../../auth/auth/auth.guard';

export class EasyCookBaseController<T extends EasyCookBaseEntity> {
    constructor(public service: EasyCookBaseService<T>) {}

    @UseGuards(AuthGuard)
    @Post()
    create(@Body() dto: any): Promise<T | ErrorResponse[]> {
        return this.service.create(dto);
    }

    @UseGuards(AuthGuard)
    @Get()
    findAll(): Promise<T[] | ErrorResponse[]> {
        return this.service.findAll();
    }

    @UseGuards(AuthGuard)
    @Get(':id')
    findOne(@Param('id') id: string): Promise<T | ErrorResponse[]> {
        return this.service.findOne(id);
    }

    @UseGuards(AuthGuard)
    @Put(':id')
    update(@Param('id') id: string, @Body() dto: any): Promise<UpdateResult | ErrorResponse[]> {
        return this.service.update(id, dto);
    }

    @UseGuards(AuthGuard)
    @Delete(':id')
    delete(@Param('id') id: string): Promise<DeleteResult | ErrorResponse[]> {
        return this.service.delete(id);
    }
}
