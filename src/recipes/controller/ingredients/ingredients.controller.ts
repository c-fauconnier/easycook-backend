import { Controller } from '@nestjs/common';
import { EasyCookBaseController } from '../../../shared/base/controller/base.controller';
import { Ingredient } from '../../entities/ingredient.entity';
import { EasyCookBaseService } from '../../../shared/base/provider/base.service';
import { IngredientsService } from '../../provider/ingredients/ingredients.service';

@Controller('ingredients')
export class IngredientsController extends EasyCookBaseController<Ingredient> {
    constructor(service: IngredientsService) {
        super(service);
    }
}
