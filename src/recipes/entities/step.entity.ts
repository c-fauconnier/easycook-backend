import { Column, Entity, ManyToOne, OneToOne } from 'typeorm';
import { EasyCookBaseEntity } from '../../shared/base/entity/base.entity';
import { Recipe } from './recipe.entity';

@Entity()
export class Step extends EasyCookBaseEntity {
    @Column()
    index: number;
    @Column()
    explanation: string;
    @Column()
    title: string;
    // @Column()
    // duration: number;

    @ManyToOne(() => Recipe, (recipe) => recipe.steps)
    recipe: Recipe;
}
