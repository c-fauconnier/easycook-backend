import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/provider/users/users.service';
import { User } from '../../users/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorResponse } from '../../shared/models/error-response';
import { JwtService } from '@nestjs/jwt';
import { Token } from '../../users/interfaces/token.interface';
const argon2 = require('argon2');

@Injectable()
export class AuthService {
    constructor(@InjectRepository(User) private usersRepo: Repository<User>, private jwtService: JwtService) {}

    async signIn(email: string, pass: string): Promise<any> {
        try {
            const user = await this.usersRepo.findOne({ where: { email: email }, relations: ['restrictions'] });

            if (!user || !(await argon2.verify(user.password, pass))) {
                return new ErrorResponse(`L'email ou le password est incorrect.`);
            }

            const payload: Token = {
                isRestricted: user.restrictions.some((r) => r.isRestricted),
                id: user.id.toString(),
                role: user.role,
            };

            return { access_token: await this.jwtService.signAsync(payload) };
        } catch (err) {
            throw err;
        }
    }
}
