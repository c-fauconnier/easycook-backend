import { HttpCode, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../../../users/provider/users/users.service';
import { User } from '../../../users/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorResponse } from '../../../shared/models/error-response';
import { JwtService } from '@nestjs/jwt';
import { Token } from '../../../users/interfaces/token.interface';
import * as jwt from 'jsonwebtoken';
import { MailerService } from '@nestjs-modules/mailer';
import { jwtConstants } from 'src/auth/auth/constants';

const argon2 = require('argon2');

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private usersRepo: Repository<User>,
        private jwtService: JwtService,
        private mailerService: MailerService
    ) {}

    async findByEmail(email: string): Promise<User> {
        const user = await this.usersRepo.findOne({ where: { email: email } });
        return user;
    }

    async updatePassword(user: User, password: string): Promise<User> {
        try {
            const hash = await (await argon2).hash(password);
            user.password = hash;
            return this.usersRepo.save(user);
        } catch (err) {
            throw new HttpException('Erreur lors de la mise à jour du mot de passe', HttpStatus.BAD_REQUEST);
        }
    }

    async login(email: string, pass: string): Promise<any> {
        try {
            const user = await this.usersRepo.findOne({ where: { email: email }, relations: ['restrictions'] });

            if (!user || !(await argon2.verify(user.password, pass))) {
                return new ErrorResponse(`L'email ou le mot de passe est incorrect.`);
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

    // Envoi d'un mail avec un lien pour changer son mot de passe
    async sendPasswordResetEmail(email): Promise<User | HttpException> {
        const user = await this.usersRepo.findOne({ where: { email: email } });

        if (!user) {
            return new HttpException('Email introuvable', HttpStatus.NOT_FOUND);
        }
        const token = jwt.sign({ email }, jwtConstants.secret, { expiresIn: '1d' });

        const resetLink = `${process.env.FEND_URL}/auth/resetPassword?token=${token}`;

        await this.mailerService.sendMail({
            to: email,
            subject: 'Réinitialisation de mot de passe',
            html: `
            <!DOCTYPE html>
            <html lang="fr">
            <head>
              <meta charset="UTF-8">
              <meta http-equiv="X-UA-Compatible" content="IE=edge">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Réinitialisation de mot de passe</title>
            </head>
            <body>
              <p>Bonjour,</p>
              <p>Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le lien ci-dessous pour procéder à la réinitialisation :</p>
              <p>
                <a href="${resetLink}">Réinitialiser le mot de passe</a>
              </p>
              <p>Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet e-mail.</p>
              <p>Merci,</p>
              <p>L'équipe de EasyCook</p>
            </body>
            </html>
            `,
            //context: { nickname:nickname, confirmationLink: confirmationLink },
            encoding: 'UTF-8',
        });

        return user;
    }
}
