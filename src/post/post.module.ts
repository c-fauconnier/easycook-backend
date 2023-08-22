import { Module } from '@nestjs/common';
import { PostService } from './provider/post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Post } from './entities/post.entity';
import { PostsController } from './controllers/controllers.controller';
import { LikedPost } from './entities/likedpost.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User, Post, LikedPost])],
    controllers: [PostsController],
    providers: [PostService],
})
export class PostModule {}
