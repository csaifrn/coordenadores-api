import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import 'dotenv/config';

const authHost = process.env.SUAP_AUTH_HOST;

@Injectable()
export class ApiService {
  
  /**
  * @param {string} token 
  * @returns {Promise<any>} 
  */
  async getUserData(token: string): Promise<any> {
    //console.log(token)
    try {
      const response = await axios.get(`${authHost}api/rh/meus-dados/`, {
        headers: {
          authorization: `Bearer ${token}`,
          accept: 'application/json'
        },
      });
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Erro ao obter dados do usuário',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
  * @param {string[]} matriculas
  * @param {string} token
  * @returns {Promise<any>}
  */
  async getAlunosData(matriculas: string[], token: string): Promise<any[]> {
    if (token) {
      return matriculas.map((matricula, index) => ({
        nome: `Aluno ${index + 1}`,
        matricula,
        email: `aluno${index + 1}@email.com`,
        telefone: `+55 (84) 99999-${String(index + 1).padStart(4, '0')}`,
      }));
    }
  }
}
