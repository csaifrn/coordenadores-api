import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
//import { SuapClient } from './client';

const authHost = 'https://suap.ifrn.edu.br/';
const clientID = 'NUw7bYAll22oHKq8eCH8I7hV3sc7pD7OPUbOSU41';
const redirectURI = 'http://localhost:8888/';
const scope = 'identificacao email documentos_pessoais';

@Injectable()
export class AuthService {
  // private suapClient: any;

  // constructor() {
  //   const authHost = 'https://suap.ifrn.edu.br';
  //   const clientID = 'NUw7bYAll22oHKq8eCH8I7hV3sc7pD7OPUbOSU41';
  //   const redirectURI = 'http://localhost:8888/';
  //   const scope = 'identificacao email documentos_pessoais';

  //   this.suapClient = new SuapClient(authHost, clientID, redirectURI, scope);
  // }

  getLoginURL(): string {
    const loginUrl = authHost + 'o/authorize/' +
      "?response_type=" + 'token' +
      "&grant_type="    + 'implicit' +
      "&client_id="     + clientID +
      "&scope="  + scope;
      "&redirect_uri="  + redirectURI;
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