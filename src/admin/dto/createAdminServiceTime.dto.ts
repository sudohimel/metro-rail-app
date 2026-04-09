import { IsString, IsNotEmpty } from 'class-validator';

export class CreateAdminServiceTimeDto {
  @IsString()
  @IsNotEmpty()
  startTime: string;

  @IsString()
  @IsNotEmpty()
  endTime: string;
}
