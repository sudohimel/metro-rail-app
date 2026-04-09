import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './entities/location.entity';
import { UpTrainSchedule } from './entities/up-train-schedule.entity';
import { DownTrainSchedule } from './entities/down-train-schedule.entity';
import { CreateLocationDto } from './dto/createLocation.dto';
import { UpdateLocationDto } from './dto/updateLocation.dto';
import { CreateUpTrainScheduleDto } from './dto/createUpTrain.dto';
import { UpdateUpTrainScheduleDto } from './dto/updateUpTrain.dto';
import { CreateDownTrainScheduleDto } from './dto/createDownTrain.dto';
import { UpdateDownTrainScheduleDto } from './dto/updateDownTrain.dto';
import { ILocation, ITrainSchedule } from './location.interface';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
    @InjectRepository(UpTrainSchedule)
    private readonly upTrainScheduleRepository: Repository<UpTrainSchedule>,
    @InjectRepository(DownTrainSchedule)
    private readonly downTrainScheduleRepository: Repository<DownTrainSchedule>,
  ) {}

  // ************** LOCATION METHODS **************

  async createLocation(createLocationDto: CreateLocationDto): Promise<ILocation> {
    const location = this.locationRepository.create(createLocationDto);
    const savedLocation = await this.locationRepository.save(location);
    return savedLocation as ILocation;
  }

  async findAllLocations(): Promise<ILocation[]> {
    const locations = await this.locationRepository
      .createQueryBuilder('location')
      .getMany();
    return locations as ILocation[];
  }

  async findLocationById(id: number): Promise<ILocation> {
    const location = await this.locationRepository
      .createQueryBuilder('location')
      .where('location.id = :id', { id })
      .getOne();

    if (!location) {
      throw new Error('Location not found');
    }
    return location as ILocation;
  }

  async updateLocation(id: number, updateLocationDto: UpdateLocationDto): Promise<ILocation> {
    await this.locationRepository
      .createQueryBuilder()
      .update(Location)
      .set(updateLocationDto)
      .where('id = :id', { id })
      .execute();

    return this.findLocationById(id);
  }

  async deleteLocation(id: number): Promise<void> {
    const deleteResult = await this.locationRepository
      .createQueryBuilder()
      .delete()
      .from(Location)
      .where('id = :id', { id })
      .execute();

    if (deleteResult.affected === 0) {
      throw new Error('Location not found');
    }
  }

  // ************** UP TRAIN SCHEDULE METHODS **************

  async createUpTrainSchedule(createUpTrainScheduleDto: CreateUpTrainScheduleDto): Promise<ITrainSchedule> {
    const upTrainSchedule = this.upTrainScheduleRepository.create(createUpTrainScheduleDto);
    const savedSchedule = await this.upTrainScheduleRepository.save(upTrainSchedule);
    return savedSchedule as ITrainSchedule;
  }

  async findAllUpTrainSchedules(): Promise<ITrainSchedule[]> {
    const schedules = await this.upTrainScheduleRepository
      .createQueryBuilder('upTrainSchedule')
      .getMany();
    return schedules as ITrainSchedule[];
  }

  async findUpTrainScheduleById(id: number): Promise<ITrainSchedule> {
    const schedule = await this.upTrainScheduleRepository
      .createQueryBuilder('upTrainSchedule')
      .where('upTrainSchedule.id = :id', { id })
      .getOne();

    if (!schedule) {
      throw new Error('Up Train Schedule not found');
    }
    return schedule as ITrainSchedule;
  }

  async updateUpTrainSchedule(id: number, updateUpTrainScheduleDto: UpdateUpTrainScheduleDto): Promise<ITrainSchedule> {
    await this.upTrainScheduleRepository
      .createQueryBuilder()
      .update(UpTrainSchedule)
      .set(updateUpTrainScheduleDto)
      .where('id = :id', { id })
      .execute();

    return this.findUpTrainScheduleById(id);
  }

  async deleteUpTrainSchedule(id: number): Promise<void> {
    const deleteResult = await this.upTrainScheduleRepository
      .createQueryBuilder()
      .delete()
      .from(UpTrainSchedule)
      .where('id = :id', { id })
      .execute();

    if (deleteResult.affected === 0) {
      throw new Error('Up Train Schedule not found');
    }
  }

  // ************** DOWN TRAIN SCHEDULE METHODS **************

  async createDownTrainSchedule(createDownTrainScheduleDto: CreateDownTrainScheduleDto): Promise<ITrainSchedule> {
    const downTrainSchedule = this.downTrainScheduleRepository.create(createDownTrainScheduleDto);
    const savedSchedule = await this.downTrainScheduleRepository.save(downTrainSchedule);
    return savedSchedule as ITrainSchedule;
  }

  async findAllDownTrainSchedules(): Promise<ITrainSchedule[]> {
    const schedules = await this.downTrainScheduleRepository
      .createQueryBuilder('downTrainSchedule')
      .getMany();
    return schedules as ITrainSchedule[];
  }

  async findDownTrainScheduleById(id: number): Promise<ITrainSchedule> {
    const schedule = await this.downTrainScheduleRepository
      .createQueryBuilder('downTrainSchedule')
      .where('downTrainSchedule.id = :id', { id })
      .getOne();

    if (!schedule) {
      throw new Error('Down Train Schedule not found');
    }
    return schedule as ITrainSchedule;
  }

  async updateDownTrainSchedule(id: number, updateDownTrainScheduleDto: UpdateDownTrainScheduleDto): Promise<ITrainSchedule> {
    await this.downTrainScheduleRepository
      .createQueryBuilder()
      .update(DownTrainSchedule)
      .set(updateDownTrainScheduleDto)
      .where('id = :id', { id })
      .execute();

    return this.findDownTrainScheduleById(id);
  }

  async deleteDownTrainSchedule(id: number): Promise<void> {
    const deleteResult = await this.downTrainScheduleRepository
      .createQueryBuilder()
      .delete()
      .from(DownTrainSchedule)
      .where('id = :id', { id })
      .execute();

    if (deleteResult.affected === 0) {
      throw new Error('Down Train Schedule not found');
    }
  }
}
