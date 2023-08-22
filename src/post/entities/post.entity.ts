import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { EasyCookBaseEntity } from '../../shared/base/entity/base.entity';
import { User } from '../../users/entities/user.entity';
import { LikedPost } from './likedpost.entity';

@Entity()
export class Post extends EasyCookBaseEntity {
    @Column({ length: 20 })
    title: string;
    @Column()
    picture: string;

    @ManyToOne(() => User, (user) => user.posts)
    user: User;
    @OneToMany(() => LikedPost, (likedPost) => likedPost.post)
    likes: LikedPost[];
}
