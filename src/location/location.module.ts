import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location } from './entities/location.entity';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { UpTrainSchedule } from './entities/up-train-schedule.entity';
import { DownTrainSchedule } from './entities/down-train-schedule.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Location, UpTrainSchedule, DownTrainSchedule])], 
  controllers: [LocationController],
  providers: [LocationService], 
  exports: [TypeOrmModule],
}) 

export class LocationModule {}
