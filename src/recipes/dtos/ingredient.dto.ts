import { Unit } from '../../shared/enums/unit.enum';

export class IngredientDto {
    picture?: string | null;
    name: string;
    quantity: number;
    unit: Unit;
}
