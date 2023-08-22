import { EasyCookBaseEntity } from 'src/shared/base/entity/base.entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, ManyToOne } from 'typeorm';
import { Post } from './post.entity';

@Entity()
export class LikedPost extends EasyCookBaseEntity {
    @ManyToOne(() => User, (user) => user.likedPosts)
    user: User;
    @ManyToOne(() => Post, (post) => post.likes)
    post: Post;
}
