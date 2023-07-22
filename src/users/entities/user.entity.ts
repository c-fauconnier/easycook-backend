import { Column, Entity, OneToMany } from 'typeorm';
import { EasyCookBaseEntity } from '../../shared/base/entity/base.entity';
import { IsEmail } from 'class-validator';
import { Role } from '../../shared/enums/role.enum';
import { Recipe } from '../../recipes/entities/recipe.entity';
import { Comment } from '../../recipes/entities/comment.entity';
import { Restriction } from './restriction.entity';

@Entity()
export class User extends EasyCookBaseEntity {
    @Column({ length: 50 })
    name: string;
    @Column({ length: 50 })
    surname: string;
    @Column({ length: 50 })
    nickname: string;
    @Column({ unique: true })
    email: string;
    @Column()
    password: string;
    @Column({ type: 'enum', enum: Role, default: Role.User })
    role: Role;
    @OneToMany(() => Recipe, (recipe) => recipe.user, { eager: true })
    recipes: Recipe[];
    @OneToMany(() => Comment, (comment) => comment.author, { eager: true })
    comments: Comment[];
    @OneToMany(() => Restriction, (restriction) => restriction.user)
    restrictions: Restriction[];
}
