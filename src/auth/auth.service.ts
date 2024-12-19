import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import 'dotenv/config';

const authHost = process.env.SUAP_AUTH_HOST;
const clientID = process.env.SUAP_CLIENT_ID;
const redirectURI = process.env.SUAP_REDIRECT_URI;
const scope = process.env.SUAP_SCOPE;

@Injectable()
export class AuthService {

  getLoginURL(): string {
    const loginUrl = authHost + 'o/authorize/' +
            "?response_type=" + 'token' +
            "&grant_type="    + 'implicit' +
            "&client_id="     + clientID +
            "&redirect_uri="  + redirectURI +
            "&scope="         + scope;
    return loginUrl;
  }

  /**
  * @param {string} token 
  * @returns {Promise<any>} 
  */
  async getUserData(token: string): Promise<any> {
    //console.log(token)
    try {
      const response = await axios.get(`${authHost}api/v2/minhas-informacoes/meus-dados/`, {
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
 * @param {string} token
 * @returns {Promise<void>}
 */
  async logout(token: string): Promise<void> {
    if (!token) {
      throw new HttpException('Token não fornecido.', HttpStatus.UNAUTHORIZED);
    }
    //console.log(token)
    try {
      await axios.post(
        `${authHost}o/revoke_token/`,
        {
          token,
          client_id: clientID,
        },
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        },
      );
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Erro ao revogar token no SUAP',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}