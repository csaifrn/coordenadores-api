import { Test, TestingModule } from '@nestjs/testing';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';

jest.mock('./api.service');

describe('ApiController', () => {
  let apiController: ApiController;
  let apiService: ApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiController],
      providers: [ApiService],
    }).compile();

    apiController = module.get<ApiController>(ApiController);
    apiService = module.get<ApiService>(ApiService);
  });

  it('should be defined', () => {
    expect(apiController).toBeDefined();
  });

  describe('processMatriculas', () => {
    it('should return students data when file is provided', async () => {
      const mockFile = {
        fieldname: 'file',
        originalname: 'matriculas.txt',
        encoding: '7bit',
        mimetype: 'text/plain',
        buffer: Buffer.from('123\n456'),
        size: 1024,
      } as Express.Multer.File;

      const mockToken = 'test-token';
      const headers = { authorization: `Bearer ${mockToken}` };
      const mockAlunos = [
        { nome: 'Aluno 1', matricula: '123', email: 'aluno1@email.com', telefone: '+55 (84) 99999-0001' },
        { nome: 'Aluno 2', matricula: '456', email: 'aluno2@email.com', telefone: '+55 (84) 99999-0002' },
      ];
      jest.spyOn(apiService, 'getAlunosData').mockResolvedValue(mockAlunos);

      const result = await apiController.processMatriculas(mockFile, headers);
      expect(result).toEqual(mockAlunos);
    });
  });
});