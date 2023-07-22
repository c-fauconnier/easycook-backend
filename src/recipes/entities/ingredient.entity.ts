import { Column, Entity, OneToMany } from 'typeorm';
import { EasyCookBaseEntity } from '../../shared/base/entity/base.entity';
import { Unit } from '../../shared/enums/unit.enum';
import { RecipeIngredient } from './recipe-ingredient.entity';

@Entity()
export class Ingredient extends EasyCookBaseEntity {
    @Column({ nullable: true })
    picture?: string | null;
    @Column({ unique: true })
    name: string;

    @OneToMany(() => RecipeIngredient, (ri) => ri.ingredient)
    recipes: RecipeIngredient[];
}
