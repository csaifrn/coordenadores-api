import { Controller, Get, Post, Headers, HttpException, HttpStatus, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiService } from './api.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadDto } from './dto/file-upload.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';

@Controller('api')
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @Get('user')
  @ApiOperation({ summary: 'Mostra seus dados do SUAP' })
  @ApiBearerAuth()
  async getUserData(@Headers() headers: any) {

    const authHeader = headers['authorization'] || headers['Authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new HttpException('Token não fornecido ou inválido', HttpStatus.UNAUTHORIZED);
    }

    const token = authHeader.replace('Bearer ', '');

    try {
      const userData = await this.apiService.getUserData(token);
      return userData;
    } catch (error) {
      throw new HttpException('Erro ao obter dados do usuário', error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('alunos')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retorna os dados dos alunos pelas matrículas' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ description: 'Arquivo de texto (txt) contendo matrículas.', type: FileUploadDto })
  @UseInterceptors(FileInterceptor('file'))
  async processMatriculas(@UploadedFile() file: Express.Multer.File, @Headers() headers: any) {
    if (!file) {
      throw new Error('Arquivo não enviado.');
    }

    const authHeader = headers['authorization'] || headers['Authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new HttpException('Token não fornecido ou inválido.', HttpStatus.UNAUTHORIZED);
    }
    const token = authHeader.split(' ')[1];

    const matriculas = file.buffer.toString('utf-8').split('\n').map(line => line.trim()).filter(line => line);
    const alunos = await this.apiService.getAlunosData(matriculas, token);
    return alunos;
  }

}
