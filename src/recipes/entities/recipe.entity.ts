import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { EasyCookBaseEntity } from '../../shared/base/entity/base.entity';
import { Step } from './step.entity';
import { RecipeIngredient } from './recipe-ingredient.entity';
import { User } from '../../users/entities/user.entity';
import { Comment } from './comment.entity';
import { FavoriteRecipe } from './favorite-recipe.entity';

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
    @Column()
    media: string;
    @Column({ default: false })
    isValid: boolean;
    @Column()
    duration: number;
    @ManyToOne(() => User, (user) => user.recipes, { onDelete: 'CASCADE' })
    user: User;
    @OneToMany(() => Step, (step) => step.recipe, { eager: true, onDelete: 'CASCADE' })
    steps: Step[];
    @OneToMany(() => RecipeIngredient, (ri) => ri.recipe, { eager: true })
    ingredients: RecipeIngredient[];
    @OneToMany(() => Comment, (comment) => comment.recipe, { eager: true, onDelete: 'CASCADE' })
    comments: Comment[];
    @OneToMany(() => FavoriteRecipe, (favoriteRecipe) => favoriteRecipe.recipe, { onDelete: 'CASCADE' })
    usersFavorites: FavoriteRecipe[];
}
