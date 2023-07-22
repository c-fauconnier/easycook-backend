import { Lecture } from '../../entities/lecture.entity';
import { LecturesService } from '../../providers/lectures/lectures.service';
import { EasyCookBaseController } from './../../../shared/base/controller/base.controller';
import { Controller } from '@nestjs/common';

@Controller('lectures')
export class LecturesController extends EasyCookBaseController<Lecture> {
    constructor(service: LecturesService) {
        super(service);
    }
}
