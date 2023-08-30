import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import * as jwt from 'jsonwebtoken';
import { jwtConstants } from 'src/auth/auth/constants';

@Injectable()
export class ConfirmEmailService {
    constructor(private readonly mailerService: MailerService) {}

    async sendConfirmationEmail(email: string, nickname: string) {
        const token = jwt.sign({ email }, jwtConstants.secret, { expiresIn: '1d' });

        const confirmationLink = `${process.env.PROD_API_URL}/confirm-email?token=${token}`;

        await this.mailerService.sendMail({
            to: email,
            subject: "Confirmation d'inscription",
            html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Confirmation d'inscription</title>
            </head>
            <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
              <table style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
                <tr>
                  <td style="text-align: center; padding: 20px 0;">
                    <h1>Confirmation d'inscription</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 20px;">
                    <p>Bonjour ${nickname},</p>
                    <p>Merci de vous être inscrit. Veuillez cliquer sur le lien ci-dessous pour confirmer votre compte :</p>
                    <p><a href="${confirmationLink}">Confirmer mon compte</a></p>
                    <p>Merci,</p>
                    <p>L'équipe de notre application.</p>
                  </td>
                </tr>
                <tr>
                  <td style="background-color: #f4f4f4; padding: 10px; text-align: center;">
                    <p style="margin: 0;">Ceci est un e-mail automatique. Veuillez ne pas y répondre.</p>
                  </td>
                </tr>
              </table>
            </body>
            </html>`,
            //context: { nickname:nickname, confirmationLink: confirmationLink },
            encoding: 'UTF-8',
        });
    }

    async sendModificationEmail(email: string, nickname: string) {
        const token = jwt.sign({ email }, jwtConstants.secret, { expiresIn: '1d' });

        const confirmationLink = `${process.env.PROD_API_URL}/confirm-email?token=${token}`;

        await this.mailerService.sendMail({
            to: email,
            subject: "Modification d'adresse email",
            html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Confirmation d'inscription</title>
          </head>
          <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
            <table style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
              <tr>
                <td style="text-align: center; padding: 20px 0;">
                  <h1>Validation de votre nouvelle adresse</h1>
                </td>
              </tr>
              <tr>
                <td style="padding: 20px;">
                  <p>Bonjour ${nickname},</p>
                  <p>vous avez récemment changé d'adresse email. Veuillez cliquer sur le lien ci-dessous pour confirmer votre nouvelle adresse :</p>
                  <p><a href="${confirmationLink}">Confirmer mon email</a></p>
                  <p>Merci,</p>
                  <p>L'équipe de notre application.</p>
                </td>
              </tr>
              <tr>
                <td style="background-color: #f4f4f4; padding: 10px; text-align: center;">
                  <p style="margin: 0;">Ceci est un e-mail automatique. Veuillez ne pas y répondre.</p>
                </td>
              </tr>
            </table>
          </body>
          </html>`,
            //context: { nickname:nickname, confirmationLink: confirmationLink },
            encoding: 'UTF-8',
        });
    }
}
