import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { Oid4VpService } from '@vdcs/oid4vp-nestjs';
import { NotImplementedException } from '@nestjs/common';

const mockOid4VpService = {
  getRequestString: jest.fn().mockImplementation(() => {
    throw new NotImplementedException();
  }),
};

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: Oid4VpService,
          useValue: mockOid4VpService,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root (getTestRoute)', () => {
    it('should call Oid4VpService.getRequestString and throw NotImplementedException', async () => {
      await expect(appController.getTestRoute()).rejects.toThrow(
        NotImplementedException,
      );

      expect(mockOid4VpService.getRequestString).toHaveBeenCalledTimes(1);
    });
  });
});
