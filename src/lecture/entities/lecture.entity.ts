import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { EasyCookBaseEntity } from '../../shared/base/entity/base.entity';
import { User } from '../../users/entities/user.entity';
import { Chapter } from './chapter.entity';

@Entity()
export class Lecture extends EasyCookBaseEntity {
    @Column({ unique: true })
    title: string;
    @Column()
    duration: number;
    @Column()
    description: string;
    @Column()
    difficulty: number;
    @Column({ default: false })
    isCompleted: boolean;
    @ManyToOne(() => User, (user) => user.lectureRate, { eager: true })
    rating: number;
    //Relationships
    @OneToMany(() => Chapter, (chapter) => chapter.lecture, { eager: true, cascade: true })
    chapters: Chapter[];
    @ManyToOne(() => User, (user) => user.lectures)
    author: User;
}
