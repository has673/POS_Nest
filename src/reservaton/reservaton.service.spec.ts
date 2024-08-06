import { Test, TestingModule } from '@nestjs/testing';
import { ReservatonService } from './reservaton.service';

describe('ReservatonService', () => {
  let service: ReservatonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReservatonService],
    }).compile();

    service = module.get<ReservatonService>(ReservatonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
