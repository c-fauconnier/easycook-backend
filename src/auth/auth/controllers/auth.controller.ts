import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Post, Query, Request, UseGuards } from '@nestjs/common';
import { AuthService } from '../providers/auth.service';
import * as jwt from 'jsonwebtoken';
import { jwtConstants } from 'src/auth/auth/constants';
import { User } from 'src/users/entities/user.entity';
import { AuthGuard } from '../auth.guard';
import { Contact } from '../dto/contact.dto';
const argon2 = require('argon2');

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @HttpCode(HttpStatus.OK)
    @Post('login')
    login(@Body() signInDto: Record<string, any>) {
        return this.authService.login(signInDto.email, signInDto.password);
    }

    @Post('forgotPassword')
    async sendPasswordResetEmail(@Body('email') email: string): Promise<User | HttpException> {
        return await this.authService.sendPasswordResetEmail(email);
    }

    @Post('resetPassword')
    async resetPassword(@Query('token') token: string, @Body('password') password: string): Promise<User | string> {
        try {
            const decodedToken = jwt.verify(token, jwtConstants.secret) as { email: string };
            const user = await this.authService.findByEmail(decodedToken.email);

            if (user) {
                return this.authService.updatePassword(user, password);
            } else {
                return 'Utilisateur non trouvé.';
            }
        } catch (error) {
            return 'Le lien de réinitialisation est invalide ou a expiré.';
        }
    }

    @Post('contact')
    async sendContactEmail(@Body() contactForm: Contact): Promise<boolean> {
        return this.authService.sendContactEmail(contactForm);
    }

    @UseGuards(AuthGuard)
    @Get('verified')
    async isEmailVerified(@Request() req: any): Promise<boolean> {
        return this.authService.isEmailVerified(req.user.id);
    }
}
