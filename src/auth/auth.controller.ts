import { Controller, Get, Headers, HttpException, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('login')
  @ApiOperation({ summary: 'Gera a URL de login no SUAP' })
  //@Redirect()
  login() {
    const loginURL = this.authService.getLoginURL();
    return { url: loginURL };
  }

    @Post('logout')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Invalida um token de login' })
    async logout(@Headers() headers: any) {

      const authHeader = headers['authorization'] || headers['Authorization'];
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new HttpException('Token não fornecido ou inválido.', HttpStatus.UNAUTHORIZED);
      }
      const token = authHeader.split(' ')[1];
      await this.authService.logout(token);
  
      return { message: 'Logout realizado com sucesso.' };
    }
}