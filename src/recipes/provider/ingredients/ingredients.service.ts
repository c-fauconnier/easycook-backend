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
        return true;
    }

    canAccess(user?: any): boolean {
        this.errors = [];
        return true;
    }

    canAccessToAll(user?: any): boolean {
        this.errors = [];
        return true;
    }

    canUpdate(user?: any): boolean {
        this.errors = [];
        return true;
    }

    canDelete(user?: any): boolean {
        this.errors = [];
        return true;
    }
}
