import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfirmEmailController } from './controller/confirm-email.controller';
import { ConfirmEmailService } from './service/confirm-email.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/provider/users/users.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        ConfirmEmailModule,
        MailerModule.forRootAsync({
            useFactory: () => ({
                transport: {
                    service: 'SendGrid', // Utilisez le service SendGrid
                    auth: {
                        api_key: process.env.SENDGRID_API_KEY, // Utilisez la variable d'environnement
                    },
                },
                defaults: {
                    from: process.env.SENDER_EMAIL, // Utilisez la variable d'environnement
                },
            }),
        }),
    ],
    controllers: [ConfirmEmailController],
    providers: [ConfirmEmailService, UsersService],
    exports: [ConfirmEmailService],
})
export class ConfirmEmailModule {}
