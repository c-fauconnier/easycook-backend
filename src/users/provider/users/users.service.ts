import { Catch, Injectable } from '@nestjs/common';
import { EasyCookBaseService } from '../../../shared/base/provider/base.service';
import { User } from '../../entities/user.entity';
import { Token } from 'src/users/interfaces/token.interface';
import { CreateUserDto } from 'src/users/interfaces/create-user.dto';
import { ErrorResponse } from 'src/shared/models/error-response';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
const argon2 = require('argon2');

@Injectable()
export class UsersService extends EasyCookBaseService<User> {
    constructor(@InjectRepository(User) private repo: Repository<User>) {
        super(repo);
    }

    canCreate(dto: CreateUserDto, user?: Token): boolean {
        this.errors = [];
        const emailRegex = new RegExp('[a-z0-9]+@[a-z]+.[a-z]{2,3}');
        if (!emailRegex.test(dto.email)) {
            const error = new ErrorResponse(`L'adresse email est invalide`, 'email');
            this.errors.push(error);
            return false;
        }
        return true;
    }
    async create(dto: CreateUserDto, user?: Token): Promise<User | ErrorResponse[]> {
        try {
            if (this.canCreate(dto, user)) {
                const hash = await (await argon2).hash(dto.password);
                dto.password = hash;
                return this.repo.save(dto);
            } else {
                return this.errors;
            }
        } catch (err) {
            throw err;
        }
    }

    canAccess(user?: Token): boolean {
        this.errors = [];
        return true;
    }

    canAccessToAll(user?: Token): boolean {
        this.errors = [];
        return true;
    }

    canUpdate(user?: Token): boolean {
        this.errors = [];
        return true;
    }

    canDelete(user?: Token): boolean {
        this.errors = [];
        return true;
    }
}
