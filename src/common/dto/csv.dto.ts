import { ApiProperty } from '@nestjs/swagger';

export class UpdateTtdDto {
  @ApiProperty({
    description: 'csv file',
    type: 'string',
    format: 'binary',
    required: true,
  })
  file: Express.Multer.File;
}
