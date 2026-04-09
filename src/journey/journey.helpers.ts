import { Repository } from 'typeorm';
import { Location } from '../location/entities/location.entity';

export async function calculateTotalMinutesTravel(locationRepository: Repository<Location>, startStationId: number, endStationId: number): Promise<number> {
  try {
    // Fetch the start station's travel time
    const startStation = await locationRepository
      .createQueryBuilder('location')
      .select('location.time', 'time')
      .where('location.id = :id', { id: startStationId })
      .getRawOne();

    // Fetch the end station's travel time
    const endStation = await locationRepository
      .createQueryBuilder('location')
      .select('location.time', 'time')
      .where('location.id = :id', { id: endStationId })
      .getRawOne();

    // Check if either station is missing or does not have a time value
    if (!startStation || !endStation || startStation.time === null || endStation.time === null) {
      throw new Error('Missing travel time for one of the stations.');
    }

    // Calculate and return the absolute difference in travel times
    return Math.abs(endStation.time - startStation.time);
  } catch (error) {
    console.error(`Error in calculateTotalMinutesTravel: ${error.message}`);
    throw new Error('Error calculating total minutes traveled');
  }
}

export async function calculateDistance(locationRepository: Repository<Location>, startStationId: number, endStationId: number): Promise<number> {
  try {
    // Fetch the start station's distance
    const startStation = await locationRepository
      .createQueryBuilder('location')
      .select('location.distance', 'distance')
      .where('location.id = :id', { id: startStationId })
      .getRawOne();

    // Fetch the end station's distance
    const endStation = await locationRepository
      .createQueryBuilder('location')
      .select('location.distance', 'distance')
      .where('location.id = :id', { id: endStationId })
      .getRawOne();

    // Check if either station is missing or does not have a distance value
    if (!startStation || !endStation || startStation.distance === null || endStation.distance === null) {
      throw new Error('Missing distance for one of the stations.');
    }

    // Calculate and return the absolute difference in distances
    return Math.abs(endStation.distance - startStation.distance);
  } catch (error) {
    console.error(`Error in calculateDistance: ${error.message}`);
    throw new Error('Error calculating distance');
  }
}

export async function calculateCost(locationRepository: Repository<Location>, startStationId: number, endStationId: number): Promise<number> {
  try {
    // Fetch the start station's fare
    const startStation = await locationRepository
      .createQueryBuilder('location')
      .select('location.fare', 'fare')
      .where('location.id = :id', { id: startStationId })
      .getRawOne();

    // Fetch the end station's fare
    const endStation = await locationRepository
      .createQueryBuilder('location')
      .select('location.fare', 'fare')
      .where('location.id = :id', { id: endStationId })
      .getRawOne();

    // Check if either station is missing or does not have a fare value
    if (!startStation || !endStation || startStation.fare === null || endStation.fare === null) {
      throw new Error('Missing fare for one of the stations.');
    }

    // Calculate and return the absolute difference in fares
    return Math.abs(endStation.fare - startStation.fare);
  } catch (error) {
    console.error(`Error in calculateCost: ${error.message}`);
    throw new Error('Error calculating cost');
  }
}

// Helper method to generate QR code
export function generateQrCode(): string {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}
