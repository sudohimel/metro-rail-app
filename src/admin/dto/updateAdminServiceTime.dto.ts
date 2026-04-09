import { IsOptional, IsString } from 'class-validator';

export class UpdateAdminServiceTimeDto {
  @IsOptional()
  @IsString()
  startTime?: string;

  @IsOptional()
  @IsString()
  endTime?: string;
}
