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
        return true;
    }

    async canSignUp(dto: CreateUserDto, user?: Token): Promise<boolean> {
        this.errors = [];
        const emailRegex = new RegExp('[a-z0-9]+@[a-z]+.[a-z]{2,3}');

        if (!emailRegex.test(dto.email)) {
            return this.generateNewError(`L'adresse email est invalide`, 'email');
        }

        const isEmailUnique = await this.verifyEmailUnicity(dto.email);

        if (!isEmailUnique) {
            return this.generateNewError(`L'adresse email est déjà prise.`, 'email');
        }
        const isNicknameUnique = await this.verifyNicknameUnicity(dto.nickname);

        if (!isNicknameUnique) {
            return this.generateNewError(`Le pseudonyme est déjà pris.`, 'nickname');
        }
        return true;
    }
    async create(dto: CreateUserDto, user?: Token): Promise<User | ErrorResponse[]> {
        try {
            if (await this.canSignUp(dto, user)) {
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

    async verifyEmailUnicity(email: string): Promise<boolean> {
        const accountWithEmail = await this.repo.findOne({ where: { email: email } });

        return !accountWithEmail ? true : false;
    }

    async verifyNicknameUnicity(nickname: string): Promise<boolean> {
        const accountWithNickname = await this.repo.findOne({ where: { nickname: nickname } });

        return !accountWithNickname ? true : false;
    }
}
