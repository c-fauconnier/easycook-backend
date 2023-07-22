import { Column, Entity, ManyToOne } from 'typeorm';
import { EasyCookBaseEntity } from '../../shared/base/entity/base.entity';
import { User } from './user.entity';

@Entity()
export class Restriction extends EasyCookBaseEntity {
    @Column({ default: false })
    isRestricted: boolean;
    @Column()
    reason: string;

    @ManyToOne(() => User, (user) => user.restrictions)
    user: User;
}
