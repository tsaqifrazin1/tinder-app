import { PreferredGenderEnum } from 'common/enum';
import { UserEntity } from 'modules/user/entitites';
import { AbstractEntityWithouId } from 'src/common/abstract';
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

@Entity('user_preferences')
export class UserPreferencesEntity extends AbstractEntityWithouId {
  @PrimaryColumn()
  id: number;

  @Column({ name: 'age_min' })
  ageMin: number;

  @Column({ name: 'age_max' })
  ageMax: number;

  @Column('enum', { enum: PreferredGenderEnum, name: 'preffered_gender' })
  preferredGender: PreferredGenderEnum;

  @OneToOne(() => UserEntity, (user) => user.preferences)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
