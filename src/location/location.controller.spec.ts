import { Test, TestingModule } from '@nestjs/testing';
import { LocationController } from './location.controller';
import { LocationService } from './location.service';
import { CreateLocationDto } from './dto/createLocation.dto';
import { Location } from './entities/location.entity';
import { UpdateLocationDto } from './dto/updateLocation.dto';

describe('LocationController', () => {
  let controller: LocationController;
  let service: LocationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LocationController],
      providers: [
        {
          provide: LocationService,
          useValue: {
            createLocation: jest.fn().mockResolvedValue({} as Location),
            findLocationById: jest.fn().mockResolvedValue({} as Location),
            updateLocation: jest.fn().mockResolvedValue({} as Location),
            deleteLocation: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    controller = module.get<LocationController>(LocationController);
    service = module.get<LocationService>(LocationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createLocation', () => {
    it('should create a new location', async () => {
      const createLocationDto: CreateLocationDto = {
        stationName: 'Station 1',
        fare: 50,
        isAvailable: true,
      };
      expect(await controller.createLocation(createLocationDto)).toEqual({});
    });
  });

  describe('getLocation', () => {
    it('should get location by id', async () => {
      const id = 1;
      expect(await controller.getLocation(id)).toEqual({});
    });
  });

  describe('updateLocation', () => {
    it('should update location by id', async () => {
      const id = 1;
      const updateLocationDto: UpdateLocationDto = {
        stationName: 'Updated Station 1',
        fare: 60,
      };
      expect(await controller.updateLocation(id, updateLocationDto)).toEqual({});
    });
  });

  describe('deleteLocation', () => {
    it('should delete location by id', async () => {
      const id = 1;
      await controller.deleteLocation(id);
      expect(service.deleteLocation).toHaveBeenCalledWith(id);
    });
  });
});
