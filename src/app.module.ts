import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UsersModule } from './users/users.module';
import { RecipesModule } from './recipes/recipes.module';

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'easycook',
            password: process.env.DB_PASSWORD,
            //A définir
            database: 'easycook',
            //Ne peut être activé pour la production.
            //Les migrations sont nécessaires pour la production.
            synchronize: true,
            retryAttempts: 10,
            autoLoadEntities: true,
        }),
        UsersModule,
        RecipesModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
    constructor(private dataSource: DataSource) {}
}
