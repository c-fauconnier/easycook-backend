import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EasyCookBaseService } from 'src/shared/base/provider/base.service';
import { Post } from '../entities/post.entity';
import { Token } from 'src/users/interfaces/token.interface';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostDto } from '../dtos/post.dto';

@Injectable()
export class PostService extends EasyCookBaseService<Post> {
    constructor(@InjectRepository(Post) private repo: Repository<Post>, @InjectRepository(User) private userRepo: Repository<User>) {
        super(repo);
    }
    canCreate(dto: PostDto, user?: Token): boolean {
        if (!dto.picture) this.generateNewError(`Le post doit contenir une image`, `picture`);

        return this.hasError();
    }
    override async create(dto: PostDto, user?: Token): Promise<Post | HttpException> {
        try {
            if (this.canCreate(dto, user)) {
                return await this.repo.save(dto);
            } else {
                throw new HttpException({ errors: this.errors }, HttpStatus.BAD_REQUEST);
            }
        } catch (err) {
            throw err;
        }
    }
    canAccess(user?: Token): boolean {
        this.errors = [];
        return this.hasError();
    }
    canAccessToAll(user?: Token): boolean {
        this.errors = [];
        return this.hasError();
    }
    canUpdate(user?: Token): boolean {
        this.errors = [];
        return this.hasError();
    }
    canDelete(user?: Token): boolean {
        return this.hasError();
    }
}
