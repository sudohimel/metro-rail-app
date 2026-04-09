// src/admin/admin.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { CreateAdminServiceTimeDto } from './dto/createAdminServiceTime.dto';

describe('AdminController', () => {
  let controller: AdminController;
  let service: AdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        {
          provide: AdminService,
          useValue: {
            createServiceTime: jest.fn(),
            getServiceTime: jest.fn(),
            updateServiceTime: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AdminController>(AdminController);
    service = module.get<AdminService>(AdminService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('setServiceTime', () => {
    it('should set service time', async () => {
      const dto = { startTime: '08:00 AM', endTime: '06:00 PM' };
      const result = await controller.setServiceTime(dto);
      expect(result).toBeDefined();
      expect(result.startTime).toBe(dto.startTime);
    });
  });
});
