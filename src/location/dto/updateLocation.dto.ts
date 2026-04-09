import { IsOptional, IsString, IsNumber, IsBoolean } from "class-validator";

export class UpdateLocationDto {
    @IsOptional()
    @IsString()
    stationName?: string;
  
    @IsOptional()
    @IsNumber()
    fare?: number;
  
    @IsOptional()
    @IsBoolean()
    isAvailable?: boolean;
  
    @IsOptional()
    @IsNumber()
    time?: number; // Time in minutes (optional)
  
    @IsOptional()
    @IsNumber()
    distance?: number; // Distance in km (optional)
  }
  