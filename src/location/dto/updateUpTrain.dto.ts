import { IsInt, IsOptional, IsString, IsBoolean } from 'class-validator';

  export class UpdateUpTrainScheduleDto {
    @IsOptional()
    @IsString()
    trainName?: string;
  
    @IsOptional()
    @IsInt()
    kamalapur?: number;
  
    @IsOptional()
    @IsInt()
    motijheel?: number;
  
    @IsOptional()
    @IsInt()
    bangladeshSecretariat?: number;
  
    @IsOptional()
    @IsInt()
    dhakaUniversity?: number;
  
    @IsOptional()
    @IsInt()
    shahbagh?: number;
  
    @IsOptional()
    @IsInt()
    kawranBazar?: number;
  
    @IsOptional()
    @IsInt()
    farmgate?: number;
  
    @IsOptional()
    @IsInt()
    bijoySarani?: number;
  
    @IsOptional()
    @IsInt()
    agargaon?: number;
  
    @IsOptional()
    @IsInt()
    shewrapara?: number;
  
    @IsOptional()
    @IsInt()
    kazipara?: number;
  
    @IsOptional()
    @IsInt()
    mirpur10?: number;
  
    @IsOptional()
    @IsInt()
    mirpur11?: number;
  
    @IsOptional()
    @IsInt()
    pallabi?: number;
  
    @IsOptional()
    @IsInt()
    uttaraSouth?: number;
  
    @IsOptional()
    @IsInt()
    uttaraCenter?: number;
  
    @IsOptional()
    @IsInt()
    uttaraNorth?: number;
  
    @IsOptional()
    @IsBoolean()
    status?: boolean; // running or not
  }
  