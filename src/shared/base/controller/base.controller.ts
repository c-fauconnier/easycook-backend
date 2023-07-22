import { DeleteResult, UpdateResult } from 'typeorm';
import { ErrorResponse } from '../../models/error-response';
import { EasyCookBaseEntity } from '../entity/base.entity';
import { EasyCookBaseService } from '../provider/base.service';
import { Controller, Get, Post, Delete, Put, Body, Param } from '@nestjs/common';

export class EasyCookBaseController<T extends EasyCookBaseEntity> {
    constructor(private readonly service: EasyCookBaseService<T>) {}

    @Post()
    create(@Body() dto: any): Promise<T | ErrorResponse[]> {
        return this.service.create(dto);
    }

    @Get()
    findAll(): Promise<T[] | ErrorResponse[]> {
        return this.service.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string): Promise<T | ErrorResponse[]> {
        return this.service.findOne(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() dto: any): Promise<UpdateResult | ErrorResponse[]> {
        return this.service.update(id, dto);
    }

    @Delete(':id')
    delete(@Param('id') id: string): Promise<DeleteResult | ErrorResponse[]> {
        return this.service.delete(id);
    }
}
