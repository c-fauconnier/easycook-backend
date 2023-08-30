import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { EasyCookBaseService } from '../../../shared/base/provider/base.service';
import { Lecture } from '../../entities/lecture.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Token } from '../../../users/interfaces/token.interface';
import { CreateLectureDto } from '../../dtos/create-lecture.dto';
import { ErrorResponse } from '../../../shared/models/error-response';
import { Chapter } from '../../entities/chapter.entity';
import { Paragraph } from '../../entities/paragraph.entity';
import { User } from '../../../users/entities/user.entity';
import { FavoriteLecture } from 'src/lecture/entities/favorite-lecture.entity';
import { Role } from 'src/shared/enums/role.enum';

@Injectable()
export class LecturesService extends EasyCookBaseService<Lecture> {
    constructor(
        @InjectRepository(Lecture) private repo: Repository<Lecture>,
        @InjectRepository(Chapter) private chaptersRepo: Repository<Chapter>,
        @InjectRepository(Paragraph) private paragraphsRepo: Repository<Paragraph>,
        @InjectRepository(User) private userRepo: Repository<User>,
        @InjectRepository(FavoriteLecture) private favoritesLecturesRepo: Repository<FavoriteLecture>,
        @InjectRepository(User) private usersRepo: Repository<User>
    ) {
        super(repo);
    }

    canCreate(dto: CreateLectureDto, user?: Token): boolean {
        this.errors = [];

        if (user.role != 'admin') {
            this.generateNewError('Vous devez être connecté pour créer un cours', 'user');
        }
        if (dto.duration <= 0) {
            this.generateNewError('La durée du cours doit être définie', 'duration');
        }
        if (dto.difficulty < 0 || dto.difficulty > 5) {
            this.generateNewError('La difficulté du cours doit être comprise entre 0 et 5', 'difficulty');
        }

        //Lorsque la connexion marche
        if (!user.id) {
            this.generateNewError(`L'auteur doit être défini`, 'userId');
        }
        if (dto.chapters.length < 1) {
            this.generateNewError('Le cours doit avoir au moins un chapitre', 'chapters');
        }

        dto.chapters.sort((a, b) => a.index - b.index);

        let lastNumber = 0;
        for (let i = 0; i < dto.chapters.length; i++) {
            if (i === 0) {
                if (dto.chapters[i].index !== 1) {
                    this.generateNewError('Le premier chapitre doit avoir le numéro 1', 'chapters');
                }
            }

            if (dto.chapters[i].isCompleted)
                this.generateNewError(`Le ou les chapitres ne peut(vent) être complété(s) à la création`, `chapters`);

            if (dto.chapters[i].index > 1) this.generateNewError(`Le numéro du chapitre doit être 1 ou plus`, 'chapters');

            if (dto.chapters[i].index !== lastNumber + 1) this.generateNewError(`L'ordre des chapitres est erroné`, 'chapters');

            lastNumber++;

            let lastParagraphNumber = 0;

            dto.chapters[i].paragraphs.sort((a, b) => a.index - b.index);

            for (let j = 0; j < dto.chapters[i].paragraphs.length; j++) {
                if (j === 0) {
                    if (dto.chapters[i].paragraphs[j].index !== 1) {
                        this.generateNewError('Le premier paragraphe doit avoir l index 1', 'paragraphs');
                    }
                }

                if (dto.chapters[i].paragraphs[j].index < 1) {
                    this.generateNewError(`Le numéro du chapitre doit être 1 ou plus`, 'chapters');
                }

                if (dto.chapters[i].paragraphs[j].index !== lastParagraphNumber + 1) {
                    this.generateNewError(`L'ordre des paragraphes est erroné`, 'paragraphs');
                }

                lastParagraphNumber++;
            }
        }
        return this.hasError();
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
                lecture.media = dto.media;
                lecture.chapters = [];
                // On enregistre chaque chapitre dans la db
                for (const chap of dto.chapters) {
                    console.log(chap);
                    const chapterEntity = new Chapter();
                    chapterEntity.title = chap.title;
                    chapterEntity.index = chap.index;
                    chapterEntity.isCompleted = chap.isCompleted;
                    chapterEntity.media = chap.media ?? '';
                    chapterEntity.paragraphs = [];
                    // On enregistre chaque paragraphe dans la db
                    for (const par of chap.paragraphs) {
                        console.log(par);
                        let paragraphEntity = new Paragraph();
                        paragraphEntity.index = par.index;
                        paragraphEntity.content = par.content;
                        const newParagraph = await this.paragraphsRepo.save(paragraphEntity);
                        chapterEntity.paragraphs.push(newParagraph);
                    }
                    const newChapter = await this.chaptersRepo.save(chapterEntity);
                    lecture.chapters.push(newChapter);
                }
                //Sauvegarde du cours dans postgreSQL
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

    async canDeleteLecture(targetId: string, user?: Token): Promise<boolean> {
        try {
            this.errors = [];

            if (!(await this.isUserOrAdmin(user, targetId))) this.generateNewError(`Vous ne pouvez pas supprimer cette recette.`, `user`);

            return this.hasError();
        } catch (err) {
            throw err;
        }
    }

    async isUserOrAdmin(user: Token, userTargetId: string): Promise<boolean> {
        const target = await this.repo.findOne({ where: { id: +userTargetId } });

        return user.role === Role.Admin || user.id === target.id.toString() ? true : false;
    }

    async delete(id: string, user?: Token): Promise<DeleteResult | HttpException> {
        console.log(id);
        try {
            if (await this.canDeleteLecture(id, user)) {
                return await this.repo.delete(id);
            } else {
                throw new HttpException({ errors: this.errors }, HttpStatus.BAD_REQUEST);
            }
        } catch (err) {
            throw err;
        }
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

    async getLecturesPerPage(page: number, limit: number): Promise<object> {
        const offset = (page - 1) * limit;
        const [items, totalCount] = await this.repo.findAndCount({
            skip: offset,
            take: limit,
        });

        const totalPages = Math.ceil(totalCount / limit);
        return { items, totalCount, totalPages };
    }

    async canAddToFavorites(user: Token, id: string): Promise<boolean> {
        try {
            const lectureToFav = !!(await this.repo.findOne({ where: { id: +id } }));

            if (!lectureToFav) {
                this.generateNewError(`Le cours n'existe pas`, `lecture`);
            }
            const alreadyFavorite = await this.favoritesLecturesRepo.find({ where: { user: { id: +user.id }, lecture: { id: +id } } });

            if (alreadyFavorite.length) {
                this.generateNewError(`Le cours est déjà dans les favoris`, `none`);
            }
            return this.hasError();
        } catch (err) {
            throw err;
        }
    }

    async addToFavorites(user: Token, id: string): Promise<FavoriteLecture | HttpException> {
        try {
            if (await this.canAddToFavorites(user, id)) {
                const userToAdd = await this.usersRepo.findOne({ where: { id: +user.id } });
                const recipeToAdd = await this.repo.findOne({ where: { id: +id } });
                const newFavoriteLecture = new FavoriteLecture();
                newFavoriteLecture.user = userToAdd;
                newFavoriteLecture.lecture = recipeToAdd;

                return await this.favoritesLecturesRepo.save(newFavoriteLecture);
            } else {
                throw new HttpException({ errors: this.errors }, HttpStatus.BAD_REQUEST);
            }
        } catch (err) {
            throw err;
        }
    }

    async isInMyFavorites(id: string, user: Token): Promise<boolean> {
        try {
            const myFavorites = await this.favoritesLecturesRepo.find({ where: { user: { id: +user.id } }, relations: ['lecture'] });
            const isFavorite = myFavorites.find((fav) => fav.lecture.id === +id);
            return isFavorite ? true : false;
        } catch (err) {
            throw err;
        }
    }

    async deleteFromMyFavorites(user: Token, id: string): Promise<DeleteResult> {
        try {
            const fav = await this.favoritesLecturesRepo.findOne({ where: { user: { id: +user.id }, lecture: { id: +id } } });
            return this.favoritesLecturesRepo.delete(fav.id);
        } catch (err) {
            throw err;
        }
    }
}
