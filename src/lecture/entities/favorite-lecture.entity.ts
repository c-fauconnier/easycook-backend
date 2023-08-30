import { EasyCookBaseEntity } from 'src/shared/base/entity/base.entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, ManyToOne } from 'typeorm';
import { Lecture } from './lecture.entity';

@Entity()
export class FavoriteLecture extends EasyCookBaseEntity {
    @ManyToOne(() => User, (user) => user.favoriteLectures, { onDelete: 'CASCADE' })
    user: User;
    @ManyToOne(() => Lecture, (lecture) => lecture.usersFavorites, { onDelete: 'CASCADE' })
    lecture: Lecture;
}
