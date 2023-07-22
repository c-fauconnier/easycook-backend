import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { EasyCookBaseEntity } from '../../shared/base/entity/base.entity';
import { Step } from './step.entity';
import { RecipeIngredient } from './recipe-ingredient.entity';
import { User } from '../../users/entities/user.entity';
import { Comment } from './comment.entity';

@Entity()
export class Recipe extends EasyCookBaseEntity {
    @Column()
    title: string;
    @Column()
    description: string;
    @Column()
    difficulty: number;
    @Column({ nullable: true, default: null })
    likes: number | null;
    @Column({ default: false })
    isValid: boolean;
    @ManyToOne(() => User, (user) => user.recipes)
    user: User;
    @OneToMany(() => Step, (step) => step.recipe, { eager: true, cascade: true })
    steps: Step[];
    @OneToMany(() => RecipeIngredient, (ri) => ri.recipe, { eager: true, cascade: true })
    ingredients: RecipeIngredient[];
    @OneToMany(() => Comment, (comment) => comment.recipe, { eager: true, cascade: true })
    comments: Comment[];
}
