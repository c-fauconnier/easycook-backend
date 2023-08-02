import { CreateChapterDto } from './create-chapter.dto';

export class CreateLectureDto {
    title: string;
    duration: number;
    difficulty: number;
    //A enlever de l'optionnel lorsque le système de connexion marche
    authorID?: number;
    chapters: CreateChapterDto[];
}
