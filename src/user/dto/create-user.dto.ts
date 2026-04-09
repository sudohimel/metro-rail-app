import { IsString, IsNotEmpty, IsEmail, IsOptional, Matches, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'Full name is required' })
  @Length(3, 100, { message: 'Full name must be between 3 and 100 characters' })
  fullName: string;

  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Phone number is required' })
  @Matches(/^[0-9]{11}$/, { message: 'Phone number must be exactly 11 digits' })
  phoneNumber: string;

  @IsString()
  @IsNotEmpty({ message: 'NID number is required' })
  @Matches(/^[0-9]{9}$/, { message: 'NID number must be exactly 9 digits' })
  nidNumber: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @Length(2, 20, { message: 'Password must be between 2 and 20 characters' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'Confirm Password is required' })
  @Length(2, 20, { message: 'Confirm Password must be between 2 and 20 characters' })
  confirmPassword: string;

  // Custom validation to ensure that password and confirmPassword are the same
  validatePasswordMatch() {
    if (this.password !== this.confirmPassword) {
      throw new Error('Passwords do not match');
    }
  }

  @IsOptional()
  @IsString()
  @Length(5, 255, { message: 'Photo URL must be between 5 and 255 characters' })
  photoUrl?: string;
}
