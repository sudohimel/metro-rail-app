// src/admin/admin.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminServiceTime } from './entities/admin.entity';
import { CreateAdminServiceTimeDto } from './dto/createAdminServiceTime.dto';
import { UpdateAdminServiceTimeDto } from './dto/updateAdminServiceTime.dto';
import { IAdminServiceTime } from './admin.interface';

import { Location } from '../location/entities/location.entity';
import { UpdateLocationDto } from '../location/dto/updateLocation.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AdminServiceTime)
    private readonly adminServiceTimeRepository: Repository<AdminServiceTime>,
  ) {}

  // Create a new admin service time
  async createServiceTime(
    createAdminServiceTimeDto: CreateAdminServiceTimeDto,
  ): Promise<IAdminServiceTime> {
    const newServiceTime = this.adminServiceTimeRepository.create(createAdminServiceTimeDto);
    return await this.adminServiceTimeRepository.save(newServiceTime);
  }

  // Get the current admin service time
  async getServiceTime(): Promise<IAdminServiceTime> {
    return await this.adminServiceTimeRepository
      .createQueryBuilder('serviceTime')
      .orderBy('serviceTime.id', 'DESC')
      .getOne();
  }

  // Update the admin service time
  async updateServiceTime(
    id: number,
    updateAdminServiceTimeDto: UpdateAdminServiceTimeDto,
  ): Promise<IAdminServiceTime> {
    await this.adminServiceTimeRepository.update(id, updateAdminServiceTimeDto);
    return this.getServiceTime(); // Return the updated service time
  }

    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>

  // View all locations
  async getAllLocations(): Promise<Location[]> {
    return await this.locationRepository
      .createQueryBuilder('location')
      .getMany();
  }

  // View location by ID
  async getLocationById(id: number): Promise<Location> {
    return await this.locationRepository
      .createQueryBuilder('location')
      .where('location.id = :id', { id })
      .getOne();
  }

  // Update location data
  async updateLocationById(id: number, updateLocationDto: UpdateLocationDto): Promise<Location> {
    const location = await this.locationRepository
      .createQueryBuilder()
      .update(Location)
      .set(updateLocationDto)
      .where('id = :id', { id })
      .returning('*') 
      .execute();

    return location.raw[0];
  }

  // Delete location by ID
  async deleteLocationById(id: number): Promise<void> {
    await this.locationRepository
      .createQueryBuilder()
      .delete()
      .from(Location)
      .where('id = :id', { id })
      .execute();
  }
}
