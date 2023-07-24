import { Lecture } from '../../entities/lecture.entity';
import { LecturesService } from '../../providers/lectures/lectures.service';
import { EasyCookBaseController } from './../../../shared/base/controller/base.controller';
import { Controller, Get, Param } from '@nestjs/common';

@Controller('lectures')
export class LecturesController extends EasyCookBaseController<Lecture> {
    constructor(service: LecturesService) {
        super(service);
    }

    @Get('title/:title')
    isTitleAlreadyTaken(@Param('title') title: string): Promise<boolean> {
        return (this.service as LecturesService).verifyTitle(title);
    }
}
