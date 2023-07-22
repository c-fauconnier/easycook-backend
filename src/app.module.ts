import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UsersModule } from './users/users.module';
import { RecipesModule } from './recipes/recipes.module';
import { LectureModule } from './lecture/lecture.module';

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'easycook',
            password: 'jS1AUG2PPvFt2L',
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
        LectureModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
    constructor(private dataSource: DataSource) {}
}
