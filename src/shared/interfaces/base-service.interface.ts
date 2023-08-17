import { HttpException } from '@nestjs/common';
//import { ErrorResponse } from '../models/error-response';

export interface BaseService<T> {
    findAll(user?: unknown): Promise<T[] | HttpException>;
    findOne(id: string, user?: unknown): Promise<T | HttpException>;
    create(dto: T, user?: unknown): Promise<unknown | HttpException>;
    update(id: string, dto: Partial<T>, user?: unknown): Promise<unknown | HttpException>;
    delete(id: string, user?: unknown): Promise<unknown | HttpException>;
}
