import { Column, Entity, ManyToOne } from 'typeorm';
import { EasyCookBaseEntity } from '../../shared/base/entity/base.entity';
import { Recipe } from './recipe.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Comment extends EasyCookBaseEntity {
    @Column({ length: 20 })
    title: string;
    @Column()
    content: string;
    @Column()
    rating: number;
    @Column({ default: 0, nullable: true })
    signals: number;
    @ManyToOne(() => User, (user) => user.comments)
    author: User;
    @ManyToOne(() => Recipe, (recipe) => recipe.comments)
    recipe: Recipe;
}
