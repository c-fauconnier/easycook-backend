import { EasyCookBaseEntity } from 'src/shared/base/entity/base.entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, ManyToOne } from 'typeorm';
import { Recipe } from './recipe.entity';

@Entity()
export class FavoriteRecipe extends EasyCookBaseEntity {
    @ManyToOne(() => User, (user) => user.favoriteRecipes, { onDelete: 'CASCADE' })
    user: User;
    @ManyToOne(() => Recipe, (recipe) => recipe.usersFavorites, { onDelete: 'CASCADE' })
    recipe: Recipe;
}
