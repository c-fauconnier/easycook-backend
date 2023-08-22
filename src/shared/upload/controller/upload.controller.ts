import { Controller, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from '../provider/upload.service';
import { AuthGuard } from '../../../auth/auth/auth.guard';

@Controller('files')
export class UploadController {
    constructor(private service: UploadService) {}

    @UseGuards(AuthGuard)
    @Post('upload')
    @UseInterceptors(FileInterceptor('media')) // 'media' correspond au nom du champ dans le formulaire
    async uploadFile(@UploadedFile() media: Express.Multer.File, @Query('collection') collection: string): Promise<object> {
        return await this.service.upload(media, collection);
    }

    // @UseGuards(AuthGuard)
    // @Post('delete')
    // async deleteFile(@Query('collection') collection: string, path: string): Promise<void> {
    //     return await this.deleteFile(collection, path);
    // }
}
