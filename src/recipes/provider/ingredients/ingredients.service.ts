import { Injectable } from '@nestjs/common';
import { EasyCookBaseService } from '../../../shared/base/provider/base.service';
import { Ingredient } from '../../entities/ingredient.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class IngredientsService extends EasyCookBaseService<Ingredient> {
    constructor(@InjectRepository(Ingredient) repo: Repository<Ingredient>) {
        super(repo);
    }

    canCreate(dto: Ingredient, user?: any): boolean {
        this.errors = [];
        return this.hasError();
    }

    canAccess(user?: any): boolean {
        this.errors = [];
        return this.hasError();
    }

    canAccessToAll(user?: any): boolean {
        this.errors = [];
        return this.hasError();
    }

    canUpdate(user?: any): boolean {
        this.errors = [];
        return this.hasError();
    }

    canDelete(user?: any): boolean {
        this.errors = [];
        return this.hasError();
    }
}
