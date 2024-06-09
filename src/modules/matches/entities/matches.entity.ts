import { UserEntity } from 'modules/user/entitites';
import { AbstractEntity } from 'src/common/abstract';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

@Entity('matches')
export class MatchesEntity extends AbstractEntity {
  @ManyToOne(() => UserEntity, (user) => user.userOneMatch)
  @JoinColumn({ name: 'user_one_id' })
  userOne: UserEntity;

  @Index()
  @Column({ name: 'user_one_id' })
  userOneId: number;

  @ManyToOne(() => UserEntity, (user) => user.userTwoMatch)
  @JoinColumn({ name: 'user_two_id' })
  userTwo: UserEntity;

  @Index()
  @Column({ name: 'user_two_id' })
  userTwoId: number;

  @Column({
    name: 'matched_at',
    type: 'date',
    default: () => 'CURRENT_TIMESTAMP',
  })
  matchedAt: Date;
}
