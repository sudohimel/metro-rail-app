// src/journey/dto/monthly-summary.dto.ts

import { IsNumber, IsNotEmpty, IsString, IsDateString } from "class-validator";

export class MonthlySummaryDto {
  @IsNumber({}, { message: "User ID must be a valid number." })
  @IsNotEmpty({ message: "User ID is required and cannot be empty." })
  userId: number;

  @IsString({ message: "Start date must be a valid string." })
  @IsDateString({}, { message: "Start date must be in the ISO 8601 format (e.g. = '2024-01-01')." })
  @IsNotEmpty({ message: "Start date is required and cannot be empty." })
  startDate: string;

  @IsString({ message: "End date must be a valid string." })
  @IsDateString({}, { message: "End date must be in the ISO 8601 format (e.g. = '2024-01-31')." })
  @IsNotEmpty({ message: "End date is required and cannot be empty." })
  endDate: string;
}
