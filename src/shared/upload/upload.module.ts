import { Module } from '@nestjs/common';
import { UploadController } from './controller/upload.controller';
import { UploadService } from './provider/upload.service';

@Module({
    controllers: [UploadController],
    providers: [UploadService],
    imports: [],
})
export class UploadModule {}
