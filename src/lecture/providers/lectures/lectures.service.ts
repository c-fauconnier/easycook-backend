import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { EasyCookBaseService } from '../../../shared/base/provider/base.service';
import { Lecture } from '../../entities/lecture.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Token } from '../../../users/interfaces/token.interface';
import { CreateLectureDto } from '../../dtos/create-lecture.dto';
import { ErrorResponse } from '../../../shared/models/error-response';
import { Chapter } from '../../entities/chapter.entity';
import { Paragraph } from '../../entities/paragraph.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class LecturesService extends EasyCookBaseService<Lecture> {
    constructor(
        @InjectRepository(Lecture) private repo: Repository<Lecture>,
        @InjectRepository(Chapter) private chaptersRepo: Repository<Chapter>,
        @InjectRepository(Paragraph) private paragraphsRepo: Repository<Paragraph>,
        @InjectRepository(User) private userRepo: Repository<User>
    ) {
        super(repo);
    }

    canCreate(dto: CreateLectureDto, user?: Token): boolean {
        this.errors = [];
        if (user.role != 'admin') {
            return this.generateNewError('Vous devez être connecté pour créer un cours', 'user');
        }
        if (dto.duration <= 0) {
            return this.generateNewError('La durée du cours doit être définie', 'duration');
        }
        if (dto.difficulty < 0 || dto.difficulty > 5) {
            return this.generateNewError('La difficulté du cours doit être comprise entre 0 et 5', 'difficulty');
        }

        //Lorsque la connexion marche
        if (!user.id) {
            this.generateNewError(`L'auteur doit être défini`, 'userId');
        }
        if (dto.chapters.length < 1) {
            return this.generateNewError('Le cours doit avoir au moins un chapitre', 'chapters');
        }

        dto.chapters.sort((a, b) => a.index - b.index);

        let lastNumber = 0;
        for (let i = 0; i < dto.chapters.length; i++) {
            if ((i = 0)) {
                if (dto.chapters[i].index !== 1) {
                    return this.generateNewError('Le premier chapitre doit avoir le numéro 1', 'chapters');
                }
            }

            if (dto.chapters[i].isCompleted)
                return this.generateNewError(`Le ou les chapitres ne peut(vent) être complété(s) à la création`, `chapters`);

            if (dto.chapters[i].index > 1) return this.generateNewError(`Le numéro du chapitre doit être 1 ou plus`, 'chapters');

            if (dto.chapters[i].index !== lastNumber + 1) return this.generateNewError(`L'ordre des chapitres est erroné`, 'chapters');

            lastNumber++;

            let lastParagraphNumber = 0;

            dto.chapters[i].paragraphs.sort((a, b) => a.index - b.index);

            for (let j = 0; j < dto.chapters[i].paragraphs.length; j++) {
                if (j === 0) {
                    if (dto.chapters[i].paragraphs[j].index !== 1) {
                        return this.generateNewError('Le premier paragraphe doit avoir l index 1', 'paragraphs');
                    }
                }

                if (dto.chapters[i].paragraphs[j].index < 1) {
                    return this.generateNewError(`Le numéro du chapitre doit être 1 ou plus`, 'chapters');
                }

                if (dto.chapters[i].paragraphs[j].index !== lastParagraphNumber + 1) {
                    return this.generateNewError(`L'ordre des paragraphes est erroné`, 'paragraphs');
                }

                lastParagraphNumber++;
            }
        }
        return true;
    }

    override async create(dto: CreateLectureDto, user?: Token): Promise<Lecture | HttpException> {
        try {
            if (this.canCreate(dto, user)) {
                const author = await this.userRepo.findOne({ where: { id: +user.id } });
                const lecture = new Lecture();
                lecture.title = dto.title;
                lecture.description = dto.description;
                lecture.duration = dto.duration;
                lecture.difficulty = dto.difficulty;
                lecture.author = author;
                lecture.chapters = [];
                // On enregistre chaque chapitre dans la db
                for (const chap of dto.chapters) {
                    let chapterEntity = new Chapter();
                    chapterEntity.title = chap.title;
                    chapterEntity.index = chap.index;
                    chapterEntity.isCompleted = chap.isCompleted;
                    chapterEntity.media = chap.media ?? '';
                    chapterEntity.paragraphs = [];
                    // On enregistre chaque paragraphe dans la db
                    for (const par of chap.paragraphs) {
                        let paragraphEntity = new Paragraph();
                        paragraphEntity.index = par.index;
                        paragraphEntity.content = par.content;
                        const newParagraph = await this.paragraphsRepo.save(paragraphEntity);
                        chapterEntity.paragraphs.push(newParagraph);
                    }
                    const newChapter = await this.chaptersRepo.save(chapterEntity);
                    lecture.chapters.push(newChapter);
                }
                // Sauvegarde du cours dans postgreSQL
                return await this.repo.save(lecture);
            } else {
                throw new HttpException({ errors: this.errors }, HttpStatus.BAD_REQUEST);
            }
        } catch (err) {
            throw err;
        }
    }

    canAccess(user?: Token): boolean {
        this.errors = [];
        return true;
    }

    canAccessToAll(user?: Token): boolean {
        this.errors = [];
        return true;
    }

    canUpdate(user?: Token): boolean {
        this.errors = [];
        return true;
    }

    canDelete(user?: Token): boolean {
        return true;
    }

    async verifyTitle(title: string): Promise<boolean> {
        try {
            return !!(await this.repo.findOne({ where: { title: title } }));
        } catch (err) {
            throw err;
        }
    }
}
