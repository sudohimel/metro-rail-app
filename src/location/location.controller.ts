import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { LocationService } from './location.service';
import { CreateLocationDto } from './dto/createLocation.dto';
import { UpdateLocationDto } from './dto/updateLocation.dto';
import { ILocation } from './location.interface';
import { CreateUpTrainScheduleDto } from './dto/createUpTrain.dto';
import { UpdateUpTrainScheduleDto } from './dto/updateUpTrain.dto';
import { CreateDownTrainScheduleDto } from './dto/createDownTrain.dto';
import { UpdateDownTrainScheduleDto } from './dto/updateDownTrain.dto';
import { ITrainSchedule } from './location.interface'; 

@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  // Location CRUD operations
  @Post('location')
  async createLocation(@Body() createLocationDto: CreateLocationDto): Promise<ILocation> {
    return this.locationService.createLocation(createLocationDto);
  }

  @Get('location')
  async getAllLocations(): Promise<ILocation[]> {
    return this.locationService.findAllLocations();
  }

  @Get('location/:id')
  async getLocation(@Param('id') id: number): Promise<ILocation> {
    return this.locationService.findLocationById(id);
  }

  @Put('location/:id')
  async updateLocation(
    @Param('id') id: number,
    @Body() updateLocationDto: UpdateLocationDto,
  ): Promise<ILocation> {
    return this.locationService.updateLocation(id, updateLocationDto);
  }

  @Delete('location/:id')
  async deleteLocation(@Param('id') id: number): Promise<void> {
    return this.locationService.deleteLocation(id);
  }

  // UpTrainSchedule CRUD operations
  @Post('up-train-schedule')
  async createUpTrainSchedule(@Body() createUpTrainScheduleDto: CreateUpTrainScheduleDto): Promise<ITrainSchedule> {
    return this.locationService.createUpTrainSchedule(createUpTrainScheduleDto);
  }

  @Get('up-train-schedule')
  async getAllUpTrainSchedules(): Promise<ITrainSchedule[]> {
    return this.locationService.findAllUpTrainSchedules();
  }

  @Get('up-train-schedule/:id')
  async getUpTrainSchedule(@Param('id') id: number): Promise<ITrainSchedule> {
    return this.locationService.findUpTrainScheduleById(id);
  }

  @Put('up-train-schedule/:id')
  async updateUpTrainSchedule(
    @Param('id') id: number,
    @Body() updateUpTrainScheduleDto: UpdateUpTrainScheduleDto,
  ): Promise<ITrainSchedule> {
    return this.locationService.updateUpTrainSchedule(id, updateUpTrainScheduleDto);
  }

  @Delete('up-train-schedule/:id')
  async deleteUpTrainSchedule(@Param('id') id: number): Promise<void> {
    return this.locationService.deleteUpTrainSchedule(id);
  }

  // DownTrainSchedule CRUD operations
  @Post('down-train-schedule')
  async createDownTrainSchedule(@Body() createDownTrainScheduleDto: CreateDownTrainScheduleDto): Promise<ITrainSchedule> {
    return this.locationService.createDownTrainSchedule(createDownTrainScheduleDto);
  }

  @Get('down-train-schedule')
  async getAllDownTrainSchedules(): Promise<ITrainSchedule[]> {
    return this.locationService.findAllDownTrainSchedules();
  }

  @Get('down-train-schedule/:id')
  async getDownTrainSchedule(@Param('id') id: number): Promise<ITrainSchedule> {
    return this.locationService.findDownTrainScheduleById(id);
  }

  @Put('down-train-schedule/:id')
  async updateDownTrainSchedule(
    @Param('id') id: number,
    @Body() updateDownTrainScheduleDto: UpdateDownTrainScheduleDto,
  ): Promise<ITrainSchedule> {
    return this.locationService.updateDownTrainSchedule(id, updateDownTrainScheduleDto);
  }

  @Delete('down-train-schedule/:id')
  async deleteDownTrainSchedule(@Param('id') id: number): Promise<void> {
    return this.locationService.deleteDownTrainSchedule(id);
  }
}
