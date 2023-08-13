import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import * as jwt from 'jsonwebtoken';
import { jwtConstants } from 'src/auth/auth/constants';

@Injectable()
export class ConfirmEmailService {
    constructor(private readonly mailerService: MailerService) {}

    async sendConfirmationEmail(email: string, nickname: string) {
        const token = jwt.sign({ email }, jwtConstants.secret, { expiresIn: '1d' });

        const confirmationLink = `http://localhost:4200/confirm-email?token=${token}`;

        await this.mailerService.sendMail({
            to: email,
            subject: "Confirmation d'inscription",
            template: '../templates/confirmation.hbs',
            context: { nickname, confirmationLink },
        });
    }
}
