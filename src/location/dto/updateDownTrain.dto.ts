import { IsInt, IsOptional, IsString, IsBoolean } from 'class-validator';

export class UpdateDownTrainScheduleDto {
  @IsOptional()
  @IsString()
  trainName?: string;

  @IsOptional()
  @IsInt()
  uttaraNorth?: number;

  @IsOptional()
  @IsInt()
  uttaraCenter?: number;

  @IsOptional()
  @IsInt()
  uttaraSouth?: number;

  @IsOptional()
  @IsInt()
  pallabi?: number;

  @IsOptional()
  @IsInt()
  mirpur11?: number;

  @IsOptional()
  @IsInt()
  mirpur10?: number;

  @IsOptional()
  @IsInt()
  kazipara?: number;

  @IsOptional()
  @IsInt()
  shewrapara?: number;

  @IsOptional()
  @IsInt()
  agargaon?: number;

  @IsOptional()
  @IsInt()
  bijoySarani?: number;

  @IsOptional()
  @IsInt()
  kawranBazar?: number;

  @IsOptional()
  @IsInt()
  shahbagh?: number;

  @IsOptional()
  @IsInt()
  dhakaUniversity?: number;

  @IsOptional()
  @IsInt()
  bangladeshSecretariat?: number;

  @IsOptional()
  @IsInt()
  motijheel?: number;

  @IsOptional()
  @IsInt()
  kamalapur?: number;

  @IsOptional()
  @IsBoolean()
  status?: boolean; // running or not
}
