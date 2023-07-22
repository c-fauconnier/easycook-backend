import { Column, Entity, ManyToOne } from 'typeorm';
import { EasyCookBaseEntity } from '../../shared/base/entity/base.entity';
import { Recipe } from './recipe.entity';
import { Ingredient } from './ingredient.entity';
import { Unit } from '../../shared/enums/unit.enum';

@Entity()
export class RecipeIngredient extends EasyCookBaseEntity {
    @Column()
    quantity: number;
    @Column({ type: 'enum', enum: Unit, default: Unit.FLAT })
    unit: Unit;
    @ManyToOne(() => Recipe, (recipe) => recipe.ingredients)
    recipe: Recipe;
    @ManyToOne(() => Ingredient, (ingredient) => ingredient.recipes, { eager: true })
    ingredient: Ingredient;
}
