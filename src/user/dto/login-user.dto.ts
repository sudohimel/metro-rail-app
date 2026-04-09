import { IsString, IsNotEmpty, Matches, Length } from 'class-validator';

export class LoginUserDto {
  @IsString()
  @IsNotEmpty({ message: 'Phone number is required' })
  @Matches(/^[0-9]{11}$/, { message: 'Phone number must be exactly 11 digits' })
  phoneNumber: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @Length(2, 20, { message: 'Password must be between 2 and 20 characters long' })
  password: string;
}
