import { IsString, IsNumber, IsBoolean } from 'class-validator';

export class CreateDownTrainScheduleDto {
  @IsString()
  trainName: string;

  @IsNumber()
  uttaraNorth: number;

  @IsNumber()
  uttaraCenter: number;

  @IsNumber()
  uttaraSouth: number;

  @IsNumber()
  pallabi: number;

  @IsNumber()
  mirpur11: number;

  @IsNumber()
  mirpur10: number;

  @IsNumber()
  kazipara: number;

  @IsNumber()
  shewrapara: number;

  @IsNumber()
  agargaon: number;

  @IsNumber()
  bijoySarani: number;

  @IsNumber()
  kawranBazar: number;

  @IsNumber()
  shahbagh: number;

  @IsNumber()
  dhakaUniversity: number;

  @IsNumber()
  bangladeshSecretariat: number;

  @IsNumber()
  motijheel: number;

  @IsNumber()
  kamalapur: number;

  @IsBoolean()
  status: boolean; // running or not
}
