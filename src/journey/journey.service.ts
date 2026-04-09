import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Journey } from './entities/journey.entity';
import { User } from '../user/entities/user.entity';
import { Location } from '../location/entities/location.entity';
import { CreateJourneyDto } from './dto/create-journey.dto';
import { StartJourneyDto } from './dto/start-journey.dto';
import { EndJourneyDto } from './dto/end-journey.dto';
import { EndJourneyResponse } from './interface/journey.interface';
import { calculateTotalMinutesTravel, calculateDistance, calculateCost, generateQrCode } from './journey.helpers'; 
import { MonthlySummaryDto } from './dto/monthly-summary.dto';

@Injectable()
export class JourneyService {
  constructor(
    @InjectRepository(Journey)
    private readonly journeyRepository: Repository<Journey>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
  ) {}

  // Create a journey
  async createJourney(createJourneyDto: CreateJourneyDto): Promise<{ qrCode: string }> {
    const { userId, startStationId, endStationId } = createJourneyDto;

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('Invalid User ID: User does not exist.');
    }

    const startStation = await this.locationRepository.findOne({ where: { id: startStationId } });
    if (!startStation) {
      throw new BadRequestException('Invalid Start Station ID: Station does not exist.');
    }

    const endStation = await this.locationRepository.findOne({ where: { id: endStationId } });
    if (!endStation) {
      throw new BadRequestException('Invalid End Station ID: Station does not exist.');
    }

    const qrCode = generateQrCode();  // Use helper method to generate QR code

    const journey = this.journeyRepository.create({
      user,
      startStation,
      endStation,
      qrCode,
    });

    await this.journeyRepository.save(journey);

    return { qrCode };
  }

  // Start a journey
  async startJourney(startJourneyDto: StartJourneyDto): Promise<{ message: string }> {
    const { userId, qrCode } = startJourneyDto;

    const journey = await this.journeyRepository.findOne({
      where: { qrCode },
      relations: ['user'],
    });

    if (!journey) {
      throw new NotFoundException('Journey not found.');
    }

    if (journey.user.id !== userId) {
      throw new BadRequestException('User ID does not match the journey.');
    }

    if (journey.startTime) {
      throw new BadRequestException('Journey already started.');
    }

    journey.startTime = new Date();
    await this.journeyRepository.save(journey);

    return { message: 'Journey started, Train Name: Metro Air 1' };
  }

  // End a journey
  async endJourney(endJourneyDto: EndJourneyDto): Promise<EndJourneyResponse> {
    const { userId, qrCode } = endJourneyDto;

    const journey = await this.journeyRepository.findOne({
      where: { qrCode },
      relations: ['user', 'startStation', 'endStation'],
    });

    if (!journey) {
      throw new NotFoundException('Journey not found.');
    }

    if (journey.user.id !== userId) {
      throw new BadRequestException('User ID does not match the journey.');
    }

    if (journey.endTime) {
      throw new BadRequestException('Journey already ended.');
    }

    if (!journey.startStation || !journey.endStation) {
      throw new BadRequestException('Journey is missing start or end station.');
    }

    const { id: startStationId } = journey.startStation;
    const { id: endStationId } = journey.endStation;

    journey.endTime = new Date();

      try {
        journey.totalMinutesTraveled = await calculateTotalMinutesTravel(this.locationRepository, startStationId, endStationId);
        journey.totalDistanceTraveled = await calculateDistance(this.locationRepository, startStationId, endStationId);
        journey.totalCost = await calculateCost(this.locationRepository, startStationId, endStationId);
      } catch (error) {
        console.error('Error during calculations:', error.message);
        throw new BadRequestException('Failed to calculate journey data.');
      }

    await this.journeyRepository.save(journey);

    return {
      fullName: journey.user.fullName,
      phoneNumber: journey.user.phoneNumber,
      startTime: journey.startTime,
      endTime: journey.endTime,
      totalMinutesTraveled: journey.totalMinutesTraveled,
      totalDistanceTraveled: journey.totalDistanceTraveled,
      totalCost: journey.totalCost,
      trainName: null, // You can set this to an actual value if available
      message: 'Journey ended successfully.',
    };
  }

  // Method to get monthly summary
  async getMonthlySummary(monthlySummaryDto: MonthlySummaryDto) {
    const { userId, startDate, endDate } = monthlySummaryDto;

    const journeys = await this.journeyRepository
      .createQueryBuilder('journey')
      .leftJoinAndSelect('journey.user', 'user')
      .leftJoinAndSelect('journey.startStation', 'startStation')
      .leftJoinAndSelect('journey.endStation', 'endStation')
      .where('journey.userId = :userId', { userId })
      .andWhere('journey.startTime BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .getMany();

    if (!journeys.length) {
      throw new NotFoundException('No journeys found for the given user and date range.');
    }

    const totalMinutesTraveled = journeys.reduce(
      (acc, journey) => acc + (journey.totalMinutesTraveled || 0),
      0,
    );

    const totalDistanceTraveled = journeys.reduce(
      (acc, journey) => acc + (journey.totalDistanceTraveled || 0),
      0,
    );

    const numberOfJourneys = journeys.length;

    const totalAmountSpent = journeys.reduce(
      (acc, journey) => acc + (journey.totalCost || 0),
      0,
    );

    return {
      username: journeys[0].user.fullName,
      totalMinutesTraveled,
      totalDistanceTraveled,
      numberOfJourneys,
      totalAmountSpent,
    };
  }
}