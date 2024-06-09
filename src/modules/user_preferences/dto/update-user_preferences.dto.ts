import { PartialType } from '@nestjs/swagger';
import { UserPreferencesDto } from './user_preferences.dto';

export class UpdateUserPreferencesDto extends PartialType(UserPreferencesDto) {}
