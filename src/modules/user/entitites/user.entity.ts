import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { AbstractEntity } from 'src/common/abstract';
import { GenderEnum } from 'common/enum/genderEnum';

@Entity({ name: 'users' })
export class UserEntity extends AbstractEntity {
  /**
   * @description Username of the user [unique, not null]
   */
  @Column({
    unique: true,
  })
  username: string;

  /**
   * @description Password of the user [not null]
   */
  @Column()
  password: string;

  /**
   * @description Email of the user [unique, not null]
   */
  @Column({
    unique: true,
  })
  email: string;

  /**
   * @description Firstname of the user [not null]
   */
  @Column()
  firstname: string;

  /**
   * @description Lastname of the user [nullable]
   */
  @Column({
    nullable: true,
  })
  lastname: string;

  /**
   * @description Gender of the user [not null]
   */
  @Column('enum', { enum: GenderEnum })
  gender: GenderEnum;

  /**
   * @description Date of birth of the user [not null]
   */
  @Column()
  bod: Date;

  /**
   * @description Bio of the user [nullable]
   */
  @Column({
    nullable: true,
  })
  bio: string;

  /**
   * @description Subscription status of the user [not null, default: false]
   */
  @Column({
    default: false,
    name: 'is_subscribed',
  })
  isSubscribed: boolean;
}
