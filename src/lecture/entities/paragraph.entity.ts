import { Column, Entity, ManyToOne } from 'typeorm';
import { EasyCookBaseEntity } from '../../shared/base/entity/base.entity';
import { Chapter } from './chapter.entity';

@Entity()
export class Paragraph extends EasyCookBaseEntity {
    @Column()
    index: number;
    @Column()
    content: string;
    @ManyToOne(() => Chapter, (chapter) => chapter.paragraphs)
    chapter: Chapter;
}
