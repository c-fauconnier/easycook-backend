import { Module } from '@nestjs/common';
import { UsersController } from './controller/users.controller';
import { UsersService } from './provider/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Restriction } from './entities/restriction.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User, Restriction])],
    controllers: [UsersController],
    providers: [UsersService],
})
export class UsersModule {}
