import { faker } from '@faker-js/faker';
import { GenderEnum } from 'common/enum';
import { UserEntity } from 'modules/user/entitites';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { UtilService } from 'utils/service/utils.service';

export class create100DifferentUsers1717922616507
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const users: UserEntity[] = [];
    for (let i = 1; i <= 100; i++) {
      const user = new UserEntity();
      user.username = i % 10 === 0 ? `user${i}Subscribed` : `user${i}`;
      user.password = await UtilService.generateHash('password');
      user.email = faker.internet.email();
      user.firstname = faker.person.firstName();
      user.lastname = faker.person.lastName();
      user.isSubscribed = i % 10 === 0 ? true : false;
      user.gender = [1, 10].includes(i) ? GenderEnum.M : GenderEnum.F;
      user.bio = faker.lorem.sentence();
      user.dob = faker.date.past({ years: 40 });
      users.push(user);
    }
    queryRunner.manager
      .getRepository(UserEntity)
      .createQueryBuilder()
      .insert()
      .values(users)
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.manager
      .getRepository(UserEntity)
      .createQueryBuilder()
      .delete()
      .execute();
  }
}
