import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { UserGetSerialization } from "src/modules/user/serializations/user.serialization";

@Exclude()
export class LoginSerialization extends UserGetSerialization {
  @ApiProperty()
  @Expose()
  token?: string;
}