import { Module } from '@nestjs/common';
import { AuthController } from './auth/controllers/auth.controller';
import { AuthService } from './auth/providers/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './auth/constants';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
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
        JwtModule.register({
            global: true,
            signOptions: { expiresIn: '7d' },
            secret: jwtConstants.secret,
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [AuthService],
})
export class AuthModule {}
