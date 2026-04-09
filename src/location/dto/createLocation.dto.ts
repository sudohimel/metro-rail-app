import { IsString, IsNotEmpty, IsNumber, IsPositive, IsBoolean, IsOptional } from "class-validator";

export class CreateLocationDto {
    @IsString()
    @IsNotEmpty()
    stationName: string;
  
    @IsNumber()
    @IsPositive()
    fare: number;
  
    @IsBoolean()
    isAvailable: boolean = true; // Default is available
  
    @IsOptional()
    @IsNumber()
    time?: number; // Time in minutes (optional)
  
    @IsOptional()
    @IsNumber()
    distance?: number; // Distance in km (optional)
  }
