import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class OtpDto {
  @IsString()
  @IsNotEmpty({ message: 'Phone number is required' })
  @Matches(/^[0-9]{11}$/, { message: 'Phone number must be exactly 11 digits' })
  phoneNumber: string;

  @IsString()
  @IsNotEmpty({ message: 'OTP is required' })
  @Matches(/^[0-9]{6}$/, { message: 'OTP must be exactly 6 digits' })
  otp: string;
}
