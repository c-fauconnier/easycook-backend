import { Chapter } from '../entities/chapter.entity';
import { CreateParagraphDto } from './create-paragraph.dto';

export class CreateChapterDto {
    index: number;
    title: string;
    isCompleted: boolean;
    media?: string;
    paragraphs: CreateParagraphDto[];
}
