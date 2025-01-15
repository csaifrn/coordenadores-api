import axios from 'axios';
import { AuthService } from './auth.service';
import { HttpException, HttpStatus } from '@nestjs/common';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('getLoginURL', () => {
    it('should generate login URL correctly', () => {
      const loginUrl = authService.getLoginURL();
      expect(loginUrl).toContain('o/authorize/');
      expect(loginUrl).toContain('response_type=token');
      expect(loginUrl).toContain(process.env.SUAP_AUTH_HOST);
      expect(loginUrl).toContain(process.env.SUAP_CLIENT_ID);
      expect(loginUrl).toContain(process.env.SUAP_REDIRECT_URI);
      expect(loginUrl).toContain(process.env.SUAP_SCOPE);
    });
  });

  describe('logout', () => {
    it('should throw an error if no token is provided', async () => {
      await expect(authService.logout('')).rejects.toThrowError(
        new HttpException('Token não fornecido.', HttpStatus.UNAUTHORIZED)
      );
    });

    it('should successfully revoke the token', async () => {
      const mockToken = 'test-token';

      mockedAxios.post.mockResolvedValue({});

      await expect(authService.logout(mockToken)).resolves.not.toThrow();

      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://suap.ifrn.edu.br/o/revoke_token/', 
        expect.objectContaining({
          token: mockToken,
        }),
        expect.objectContaining({
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        })
      );
    });

    it('should throw an error if axios fails', async () => {
      const mockToken = 'test-token';
      // Mockando um erro de axios
      mockedAxios.post.mockRejectedValue({
        response: { data: 'Error', status: HttpStatus.INTERNAL_SERVER_ERROR },
      });

      await expect(authService.logout(mockToken)).rejects.toThrowError(
        new HttpException('Error', HttpStatus.INTERNAL_SERVER_ERROR)
      );
    });
  });
});