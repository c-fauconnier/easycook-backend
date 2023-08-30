import { IngredientDto } from './ingredient.dto';
import { StepDto } from './step.dto';

export class CreateRecipeDto {
    title: string;
    description: string;
    difficulty: number;
    likes: number | null;
    media: string | null;
    duration: number;
    steps: StepDto[];
    ingredients: IngredientDto[];
    name: string;
    user: number;
}
