import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

const trimString = ({ value }: { value: unknown }) => {
  if (typeof value === 'string') {
    return value.trim();
  }
  return value;
};

export class UserSignupDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(20)
  @Transform(trimString)
  username: string;

  @IsEmail()
  @IsNotEmpty()
  @Transform(trimString)
  email: string;

  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(20)
  @Transform(trimString)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(20)
  @Transform(trimString)
  lastName: string;

  @IsPhoneNumber('IN')
  @IsNotEmpty()
  phoneNumber: string;
}
