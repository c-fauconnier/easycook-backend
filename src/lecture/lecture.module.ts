import { Module } from '@nestjs/common';
import { LecturesController } from './controllers/lectures/lectures.controller';
import { LecturesService } from './providers/lectures/lectures.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Lecture } from './entities/lecture.entity';
import { Chapter } from './entities/chapter.entity';
import { Paragraph } from './entities/paragraph.entity';
import { FavoriteLecture } from './entities/favorite-lecture.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User, Lecture, Chapter, Paragraph, FavoriteLecture])],
    controllers: [LecturesController],
    providers: [LecturesService],
})
export class LectureModule {}
