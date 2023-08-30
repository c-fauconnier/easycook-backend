import { Column, Entity, OneToMany } from 'typeorm';
import { EasyCookBaseEntity } from '../../shared/base/entity/base.entity';
import { IsEmail } from 'class-validator';
import { Role } from '../../shared/enums/role.enum';
import { Recipe } from '../../recipes/entities/recipe.entity';
import { Comment } from '../../recipes/entities/comment.entity';
import { Restriction } from './restriction.entity';
import { Lecture } from '../../lecture/entities/lecture.entity';
import { Post } from '../../post/entities/post.entity';
import { LikedPost } from 'src/post/entities/likedpost.entity';
import { FavoriteRecipe } from 'src/recipes/entities/favorite-recipe.entity';
import { FavoriteLecture } from 'src/lecture/entities/favorite-lecture.entity';

@Entity()
export class User extends EasyCookBaseEntity {
    @Column({ length: 50 })
    name: string;
    @Column({ type: 'boolean', default: false })
    isEmailVerified: boolean;
    @Column({ length: 50 })
    surname: string;
    @Column({ length: 50, unique: true })
    nickname: string;
    @Column({ unique: true })
    email: string;
    @Column()
    password: string;
    @Column({ type: 'enum', enum: Role, default: Role.User })
    role: Role;
    @OneToMany(() => Recipe, (recipe) => recipe.user, { eager: true, onDelete: 'CASCADE' })
    recipes: Recipe[];
    @OneToMany(() => Comment, (comment) => comment.author, { eager: true, onDelete: 'CASCADE' })
    comments: Comment[];
    @OneToMany(() => Lecture, (lecture) => lecture.author, { onDelete: 'CASCADE' })
    lectures: Lecture[];
    @OneToMany(() => Lecture, (lecture) => lecture.rating, { onDelete: 'CASCADE' })
    lectureRate: Lecture[];
    @OneToMany(() => Restriction, (restriction) => restriction.user, { onDelete: 'CASCADE' })
    restrictions: Restriction[];
    @OneToMany(() => Post, (post) => post.user, { onDelete: 'CASCADE' })
    posts: Post[];
    @OneToMany(() => LikedPost, (likedPost) => likedPost.user, { onDelete: 'CASCADE' })
    likedPosts: LikedPost[];
    @OneToMany(() => FavoriteRecipe, (favoriteRecipe) => favoriteRecipe.user, { eager: true, onDelete: 'CASCADE' })
    favoriteRecipes: FavoriteRecipe[];
    @OneToMany(() => FavoriteLecture, (favoriteLecture) => favoriteLecture.user, { eager: true, onDelete: 'CASCADE' })
    favoriteLectures: FavoriteLecture[];
}
