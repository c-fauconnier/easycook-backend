import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfirmEmailController } from './controller/confirm-email.controller';
import { ConfirmEmailService } from './provider/confirm-email.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/provider/users/users.service';
import { FavoriteRecipe } from 'src/recipes/entities/favorite-recipe.entity';
import { FavoriteLecture } from 'src/lecture/entities/favorite-lecture.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, FavoriteRecipe, FavoriteLecture]),
        ConfirmEmailModule,
        MailerModule.forRootAsync({
            useFactory: async () => ({
                transport: {
                    host: 'smtp.sendgrid.net',
                    port: 587,
                    auth: {
                        user: 'apikey', // SendGrid API key
                        pass: process.env.SENDGRID_API_KEY,
                    },
                },
                defaults: {
                    from: process.env.SENDER_EMAIL,
                    textEncoding: 'utf-8',
                },
            }),
        }),
    ],
    controllers: [ConfirmEmailController],
    providers: [ConfirmEmailService, UsersService],
    exports: [ConfirmEmailService],
})
export class ConfirmEmailModule {}
