import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UsersModule } from './users/users.module';
import { RecipesModule } from './recipes/recipes.module';
import { LectureModule } from './lecture/lecture.module';
import { AuthModule } from './auth/auth.module';
import { ConfirmEmailModule } from './confirm-email/confirm-email.module';
import { UploadModule } from './shared/upload/upload.module';
import * as dotenv from 'dotenv';

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: process.env.USERNAME_POSTGRESQL,
            password: process.env.PASSWORD_POSTGRESQL,
            //A définir
            database: process.env.DATABASE,
            //Ne peut être activé pour la production.
            //Les migrations sont nécessaires pour la production.
            synchronize: true,
            retryAttempts: 10,
            autoLoadEntities: true,
        }),
        UsersModule,
        RecipesModule,
        LectureModule,
        AuthModule,
        ConfirmEmailModule,
        UploadModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
    constructor(private dataSource: DataSource) {}
}
