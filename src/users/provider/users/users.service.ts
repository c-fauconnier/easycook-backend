import { Catch, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EasyCookBaseService } from '../../../shared/base/provider/base.service';
import { User } from '../../entities/user.entity';
import { Token } from 'src/users/interfaces/token.interface';
import { CreateUserDto } from 'src/users/interfaces/create-user.dto';
import { ErrorResponse } from 'src/shared/models/error-response';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import { Role } from 'src/shared/enums/role.enum';

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
            console.log('invalid');

            this.generateNewError(`L'adresse email est invalide.`, 'email');
        }

        const isEmailUnique = await this.verifyEmailUnicity(dto.email);

        if (!isEmailUnique) {
            this.generateNewError(`L'adresse email est déjà prise.`, 'email');
        }
        const isNicknameUnique = await this.verifyNicknameUnicity(dto.nickname);

        if (!isNicknameUnique) {
            this.generateNewError(`Le pseudonyme est déjà pris.`, 'nickname');
        }

        return this.hasError();
    }
    async create(dto: CreateUserDto, user?: Token): Promise<User | HttpException> {
        try {
            if (await this.canSignUp(dto, user)) {
                const hash = await (await argon2).hash(dto.password);
                dto.password = hash;
                return this.repo.save(dto);
            } else {
                throw new HttpException({ errors: this.errors }, HttpStatus.BAD_REQUEST);
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

        if (user.role !== Role.Admin) {
            this.generateNewError(`Vous ne pouvez pas accéder à ce service`, `user`);
        }
        return this.hasError();
    }

    canUpdate(user?: Token): boolean {
        this.errors = [];
        return true;
    }

    async canDeleteUser(targetId: string, user?: Token): Promise<boolean> {
        try {
            this.errors = [];

            if (!(await this.isUserOrAdmin(user, targetId))) this.generateNewError(`Vous ne pouvez pas supprimer cet utilisateur.`, `user`);

            return this.hasError();
        } catch (err) {
            throw err;
        }
    }

    async delete(id: string, user?: Token): Promise<DeleteResult | HttpException> {
        try {
            if (await this.canDeleteUser(id, user)) {
                return await this.repo.delete(id);
            } else {
                throw new HttpException({ errors: this.errors }, HttpStatus.BAD_REQUEST);
            }
        } catch (err) {
            throw err;
        }
    }

    canDelete(user?: Token): boolean {
        return false;
    }

    async verifyEmailUnicity(email: string): Promise<boolean> {
        const accountWithEmail = await this.repo.findOne({ where: { email: email } });

        return !accountWithEmail ? true : false;
    }

    async verifyNicknameUnicity(nickname: string): Promise<boolean> {
        const accountWithNickname = await this.repo.findOne({ where: { nickname: nickname } });

        return !accountWithNickname ? true : false;
    }

    async findByEmail(email: string): Promise<User> {
        const user = await this.repo.findOne({ where: { email: email } });
        return user;
    }

    async isUserOrAdmin(user: Token, userTargetId: string): Promise<boolean> {
        const target = await this.repo.findOne({ where: { id: +userTargetId } });

        return user.role === Role.Admin || user.id === target.id.toString() ? true : false;
    }
}
