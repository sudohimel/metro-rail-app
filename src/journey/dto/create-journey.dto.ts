import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';
import { CreateJourney } from '../interface/journey.interface';

export class CreateJourneyDto implements CreateJourney {
  @IsInt({ message: 'User ID must be an integer.' })
  @IsPositive({ message: 'User ID must be a positive number.' })
  @IsNotEmpty({ message: 'User ID is required.' })
  userId: number;

  @IsInt({ message: 'Start Station ID must be an integer.' })
  @IsPositive({ message: 'Start Station ID must be a positive number.' })
  @IsNotEmpty({ message: 'Start Station ID is required.' })
  startStationId: number;

  @IsInt({ message: 'End Station ID must be an integer.' })
  @IsPositive({ message: 'End Station ID must be a positive number.' })
  @IsNotEmpty({ message: 'End Station ID is required.' })
  endStationId: number;
}
