// upTrainSchedule.dto.ts
import { IsString, IsNumber, IsBoolean } from 'class-validator';

export class CreateUpTrainScheduleDto {
  @IsString()
  trainName: string;

  @IsNumber()
  kamalapur: number;

  @IsNumber()
  motijheel: number;

  @IsNumber()
  bangladeshSecretariat: number;

  @IsNumber()
  dhakaUniversity: number;

  @IsNumber()
  shahbagh: number;

  @IsNumber()
  kawranBazar: number;

  @IsNumber()
  farmgate: number;

  @IsNumber()
  bijoySarani: number;

  @IsNumber()
  agargaon: number;

  @IsNumber()
  shewrapara: number;

  @IsNumber()
  kazipara: number;

  @IsNumber()
  mirpur10: number;

  @IsNumber()
  mirpur11: number;

  @IsNumber()
  pallabi: number;

  @IsNumber()
  uttaraSouth: number;

  @IsNumber()
  uttaraCenter: number;

  @IsNumber()
  uttaraNorth: number;

  @IsBoolean()
  status: boolean; // running or not
}
