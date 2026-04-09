import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JourneyController } from './journey.controller';
import { JourneyService } from './journey.service';
import { Journey } from './entities/journey.entity';
import { UserModule } from '../user/user.module';
import { LocationModule } from '../location/location.module';

@Module({
  imports: [TypeOrmModule.forFeature([Journey]), UserModule, LocationModule],
  controllers: [JourneyController],
  providers: [JourneyService],
})
export class JourneyModule {}
