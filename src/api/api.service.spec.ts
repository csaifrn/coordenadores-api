import { ApiService } from './api.service';
import axios from 'axios';
import { HttpException, HttpStatus } from '@nestjs/common';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ApiService', () => {
  let apiService: ApiService;

  beforeEach(() => {
    apiService = new ApiService();
  });

  it('should be defined', () => {
    expect(apiService).toBeDefined();
  });

  describe('getUserData', () => {
    it('should return user data when request is successful', async () => {
      const mockToken = 'test-token';
      const mockResponse = { data: { id: 1, name: 'John Doe' } };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await apiService.getUserData(mockToken);
      expect(result).toEqual(mockResponse.data);
    });

    it('should throw an error when request fails', async () => {
      const mockToken = 'test-token';

      mockedAxios.get.mockRejectedValue({
        response: { data: 'Error', status: HttpStatus.INTERNAL_SERVER_ERROR },
      });

      await expect(apiService.getUserData(mockToken)).rejects.toThrowError(
        new HttpException('Error', HttpStatus.INTERNAL_SERVER_ERROR)
      );
    });
  });

  describe('getAlunosData', () => {
    it('should return an array of student data', async () => {
      const mockMatriculas = ['123', '456'];
      const mockToken = 'test-token';
      const result = await apiService.getAlunosData(mockMatriculas, mockToken);

      expect(result).toHaveLength(2);
      expect(result[0].matricula).toBe('123');
      expect(result[1].matricula).toBe('456');
    });
  });
});