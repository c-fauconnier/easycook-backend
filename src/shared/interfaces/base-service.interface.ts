import { ErrorResponse } from '../models/error-response';

export interface BaseService<T> {
    findAll(user?: unknown): Promise<T[] | ErrorResponse[]>;
    findOne(id: string, user?: unknown): Promise<T | ErrorResponse[]>;
    create(dto: T, user?: unknown): Promise<unknown | ErrorResponse[]>;
    update(id: string, dto: Partial<T>, user?: unknown): Promise<unknown | ErrorResponse[]>;
    delete(id: string, user?: unknown): Promise<unknown | ErrorResponse[]>;
}
