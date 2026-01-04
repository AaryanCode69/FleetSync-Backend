import { IsNotEmpty, IsString } from 'class-validator';

export class UserLoginDto {
  @IsNotEmpty()
  @IsString()
  identifier: string; // can be either username or email

  @IsString()
  @IsNotEmpty()
  password: string;
}
