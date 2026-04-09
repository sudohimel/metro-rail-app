// src/admin/admin.controller.ts
import { Controller, Get, Post, Put, Body, Delete, Param } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminServiceTimeDto } from './dto/createAdminServiceTime.dto';
import { UpdateAdminServiceTimeDto } from './dto/updateAdminServiceTime.dto';
import { IAdminServiceTime } from './admin.interface';

import { UpdateLocationDto } from '../location/dto/updateLocation.dto';
import { Location } from '../location/entities/location.entity';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // Set the service times
  @Post('set-service-time')
  async setServiceTime(
    @Body() createAdminServiceTimeDto: CreateAdminServiceTimeDto,
  ): Promise<IAdminServiceTime> {
    return this.adminService.createServiceTime(createAdminServiceTimeDto);
  }

  // Get the current service times
  @Get('get-service-time')
  async getServiceTime(): Promise<IAdminServiceTime> {
    return this.adminService.getServiceTime();
  }

  // Update the service times
  @Put('update-service-time')
  async updateServiceTime(
    @Body() updateAdminServiceTimeDto: UpdateAdminServiceTimeDto,
  ): Promise<IAdminServiceTime> {
    const serviceTime = await this.adminService.getServiceTime();
    return this.adminService.updateServiceTime(serviceTime.id, updateAdminServiceTimeDto);
  }

  // Get all locations
  @Get('locations')
  async getAllLocations(): Promise<Location[]> {
    return this.adminService.getAllLocations();
  }

  // Get location by ID
  @Get('location/:id')
  async getLocationById(@Param('id') id: number): Promise<Location> {
    return this.adminService.getLocationById(id);
  }

  // Update location by ID
  @Put('location/:id')
  async updateLocationById(
    @Param('id') id: number,
    @Body() updateLocationDto: UpdateLocationDto,
  ): Promise<Location> {
    return this.adminService.updateLocationById(id, updateLocationDto);
  }

  // Delete location by ID
  @Delete('location/:id')
  async deleteLocationById(@Param('id') id: number): Promise<void> {
    return this.adminService.deleteLocationById(id);
  }
}
