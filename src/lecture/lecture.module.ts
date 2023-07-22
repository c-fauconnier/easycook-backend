import { Module } from '@nestjs/common';
import { LecturesController } from './controllers/lectures/lectures.controller';
import { LecturesService } from './providers/lectures/lectures.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Lecture } from './entities/lecture.entity';
import { Chapter } from './entities/chapter.entity';
import { Paragraph } from './entities/paragraph.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User, Lecture, Chapter, Paragraph])],
    controllers: [LecturesController],
    providers: [LecturesService],
})
export class LectureModule {}
