import { UserEntity } from 'modules/user/entitites';

export class MatchesDto {
  userOne?: UserEntity;
  userTwo?: UserEntity;

  userOneId?: number;
  userTwoId?: number;
}
