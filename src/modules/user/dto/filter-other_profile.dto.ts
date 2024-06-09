import { PreferredGenderEnum } from 'common/enum';

export class FilterOtherProfileDto {
  ageMin?: number;
  ageMax?: number;
  preferredGender?: PreferredGenderEnum;
}
