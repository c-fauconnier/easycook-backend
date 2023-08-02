import { Controller, Get, HttpCode, HttpStatus, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    getHello(): string {
        return this.appService.getHello();
    }
}
