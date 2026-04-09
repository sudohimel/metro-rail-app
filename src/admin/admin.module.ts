import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { AdminServiceTime } from './entities/admin.entity';
import { LocationModule } from '../location/location.module';

import { Location } from '../location/entities/location.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AdminServiceTime]), TypeOrmModule.forFeature([Location]), LocationModule],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
