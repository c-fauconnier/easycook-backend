import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { initializeFirebaseApp } from './config/firebase.config';

initializeFirebaseApp();

async function bootstrap() {
    const httpsOptions = {
        key: fs.readFileSync(process.env.CERTBOT_KEY),
        cert: fs.readFileSync(process.env.CERTBOT_CERT),
    };
    const app = await NestFactory.create(AppModule, { httpsOptions });
    // On authorise le CORS
    app.enableCors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        preflightContinue: false,
        allowedHeaders: ['Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization'],
        exposedHeaders: ['Content-Disposition'],
    });
    await app.listen(process.env.PORT);
}
export default bootstrap();
