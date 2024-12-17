import { Controller, Get, Redirect, Headers, HttpException, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('login')
  @Redirect()
  login() {
    const loginURL = this.authService.getLoginURL();
    return { url: loginURL };
  }

  @Get('user')
  async getUserData(@Headers() headers: any) {

    //console.log('Headers:', headers);
    const authHeader = headers['authorization'] || headers['Authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new HttpException('Token não fornecido ou inválido', HttpStatus.UNAUTHORIZED);
    }

    const token = authHeader.replace('Bearer ', '');

    try {
      const userData = await this.authService.getUserData(token);
      return userData;
    } catch (error) {
      throw new HttpException('Erro ao obter dados do usuário', error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

    @Post('logout')
    async logout(@Headers('authorization') authHeader: string) {
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new HttpException('Token não fornecido ou inválido.', HttpStatus.UNAUTHORIZED);
      }
  
      const token = authHeader.split(' ')[1];
      await this.authService.logout(token);
  
      return { message: 'Logout realizado com sucesso.' };
    }
}