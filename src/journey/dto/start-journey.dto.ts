import { IsString, IsNotEmpty, IsInt, IsPositive } from 'class-validator';
import { StartJourney } from '../interface/journey.interface';

export class StartJourneyDto implements StartJourney {
    @IsInt({ message: 'User ID must be an integer.' })
    @IsPositive({ message: 'User ID must be a positive number.' })
    @IsNotEmpty({ message: 'User ID is required.' })
    userId: number;

    @IsString({ message: 'QR Code must be a string.' })
    @IsNotEmpty({ message: 'QR Code is required.' })
    qrCode: string;
}
