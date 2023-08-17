import { Controller, Get, Query } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { UsersService } from 'src/users/provider/users/users.service';
import { jwtConstants } from 'src/auth/auth/constants';

@Controller()
export class ConfirmEmailController {
    constructor(private readonly userService: UsersService) {}

    /*
     * route qui reçoit un token pour valider un mail
     */
    @Get('confirm-email')
    async confirmEmail(@Query('token') token: string): Promise<string> {
        try {
            const decodedToken = jwt.verify(token, jwtConstants.secret) as { email: string };
            const user = await this.userService.findByEmail(decodedToken.email);

            if (user) {
                user.isEmailVerified = true;
                await user.save();
                return 'Votre e-mail a été vérifié avec succès.';
            } else {
                return 'Utilisateur non trouvé.';
            }
        } catch (error) {
            return 'Le lien de confirmation est invalide ou a expiré.';
        }
    }
}
