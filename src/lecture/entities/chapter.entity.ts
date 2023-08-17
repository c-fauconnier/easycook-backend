import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { EasyCookBaseEntity } from '../../shared/base/entity/base.entity';
import { Lecture } from './lecture.entity';
import { Paragraph } from './paragraph.entity';

@Entity()
export class Chapter extends EasyCookBaseEntity {
    @Column()
    index: number;
    @Column()
    title: string;

    @Column({ default: false })
    isCompleted: boolean;
    @Column({ nullable: true })
    media?: string;
    @ManyToOne(() => Lecture, (lecture) => lecture.chapters)
    lecture: Lecture;
    @OneToMany(() => Paragraph, (paragraph) => paragraph.chapter, { eager: true, cascade: true })
    paragraphs: Paragraph[];
}
