import { Controller } from '@nestjs/common';
import { EasyCookBaseController } from 'src/shared/base/controller/base.controller';
import { Post } from '../entities/post.entity';

@Controller('posts')
export class PostsController extends EasyCookBaseController<Post> {}
