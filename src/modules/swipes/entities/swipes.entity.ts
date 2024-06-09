import { SwipeActionEnum } from 'common/enum';
import { UserEntity } from 'modules/user/entitites';
import { AbstractEntity } from 'src/common/abstract';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

@Entity('swipes')
@Index(['swipedId', 'swiperId'], { unique: true })
export class SwipesEntity extends AbstractEntity {
  @ManyToOne(() => UserEntity, (user) => user.swiped)
  @JoinColumn({ name: 'swiped_id' })
  swiped: UserEntity;

  @Index()
  @Column({ name: 'swiped_id' })
  swipedId: number;

  @ManyToOne(() => UserEntity, (user) => user.swiper)
  @JoinColumn({ name: 'swiper_id' })
  swiper: UserEntity;

  @Index()
  @Column({ name: 'swiper_id' })
  swiperId: number;

  @Column('enum', { enum: SwipeActionEnum })
  action: SwipeActionEnum;

  @Index()
  @Column({
    name: 'swiped_at',
    type: 'date',
    default: () => 'CURRENT_TIMESTAMP',
  })
  swipedAt: Date;
}
