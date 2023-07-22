import { Chapter } from '../entities/chapter.entity';
import { CreateParagraphDto } from './create-paragraph.dto';

export class CreateChapterDto {
    number: number;
    title: string;
    isCompleted: boolean;
    video?: string;
    paragraphs: CreateParagraphDto[];
}
