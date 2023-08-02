import { Get, Injectable, UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth/auth/auth.guard';

@Injectable()
export class AppService {
    @UseGuards(AuthGuard)
    @Get('')
    getHello(): string {
        return 'Hello World!';
    }
}
