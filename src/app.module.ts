import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { HttpModule } from '@nestjs/axios';
import { ApiModule } from './api/api.module';

@Module({
  imports: [AuthModule, HttpModule, ApiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
