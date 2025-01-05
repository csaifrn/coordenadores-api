import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Coordenação API')
    .setDescription('API para o aplicativo que visa permitir que os coordenadores de curso superior do IFRN CNAT consigam obter os dados dos alunos de forma prática.')
    .setVersion('beta')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 8888);
}
bootstrap();