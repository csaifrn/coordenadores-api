## Descrição

API para o aplicativo que visa permitir que os coordenadores de curso superior do IFRN CNAT consigam obter os dados dos alunos de forma prática.

## Como iniciar o projeto

```bash
# instalar as dependências
$ npm i

# iniciar a aplicação
$ npm run start
```
## Como usar os endpoints

### Pelo Swagger
- Acesse pelo navegador o link da api: `http://localhost:8888/api/`;
- Clique em "Try it out" no GET de login e depois em "Execute";
- Copie o link em "Response body" e cole no seu navegador;
- Faça o login com sua conta do SUAP e permita a aplicação;
- Copie o token no link da página redirecionada, ele aparecerá assim: `[...]#access_token=<seu_token>&[...]`;
- Volte para o link da api e clique no botão à direita "Authorize";
- Insira o seu token copiado, clique em "Authorize" e pode fechar o modal;
- Agora você pode testar os endpoints que têm um cadeado no lado direito.

### Pelo REST Client
- Tenha instalado no seu VS Code a extensão "REST Client";
- Abra o arquivo "root.http" na pasta "rest-client";
- Clique em "Send Request" acima de `GET http://localhost:8888/auth/login/`;
- Acesse a URL que aparecer na aba "Response";
- Faça o login com sua conta do SUAP e permita a aplicação;
- Copie o token no link da página redirecionada, ele aparecerá assim: `[...]#access_token=<seu_token>&[...]`;
- Volte para o arquivo "root.http" no VS Code;
- Substitua onde tiver `<seu_token>` pelo seu token copiado;
- Agora você pode testar os endpoints que necessitam de autorização.
