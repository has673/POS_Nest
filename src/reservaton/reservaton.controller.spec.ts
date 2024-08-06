import { Test, TestingModule } from '@nestjs/testing';
import { ReservatonController } from './reservaton.controller';
import { ReservatonService } from './reservaton.service';

describe('ReservatonController', () => {
  let controller: ReservatonController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservatonController],
      providers: [ReservatonService],
    }).compile();

    controller = module.get<ReservatonController>(ReservatonController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
