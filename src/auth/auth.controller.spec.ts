import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { HttpException, HttpStatus } from '@nestjs/common';

jest.mock('./auth.service');

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('login', () => {
    it('should return a login URL', () => {
      const result = 'http://test-login-url';
      jest.spyOn(authService, 'getLoginURL').mockReturnValue(result);

      expect(authController.login()).toEqual({ url: result });
    });
  });

  describe('logout', () => {
    it('should throw an error if no token is provided', async () => {
      await expect(authController.logout({})).rejects.toThrowError(
        new HttpException('Token não fornecido ou inválido.', HttpStatus.UNAUTHORIZED)
      );
    });

    it('should call authService.logout if token is provided', async () => {
      const token = 'test-token';
      const headers = { authorization: `Bearer ${token}` };
      const logoutSpy = jest.spyOn(authService, 'logout').mockResolvedValue(undefined);

      await authController.logout(headers);

      expect(logoutSpy).toHaveBeenCalledWith(token);
    });

    it('should throw error if authService throws an error', async () => {
      const token = 'test-token';
      const headers = { authorization: `Bearer ${token}` };
      jest.spyOn(authService, 'logout').mockRejectedValue(
        new HttpException('Error', HttpStatus.INTERNAL_SERVER_ERROR)
      );

      await expect(authController.logout(headers)).rejects.toThrowError(
        new HttpException('Error', HttpStatus.INTERNAL_SERVER_ERROR)
      );
    });
  });
});