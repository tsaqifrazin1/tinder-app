import { PartialType } from '@nestjs/swagger';
import { MatchesDto } from './matches.dto';

export class UpdateMatchesDto extends PartialType(MatchesDto) {}