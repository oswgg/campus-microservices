import { Module } from '@nestjs/common';
import { ApiKeyModule } from './api-keys/api-key.module';
import { JwtModule } from '@nestjs/jwt';
import { EncrypterModule } from './encrypter/encrypter.module';
import { ConfigModule } from './config.module';

@Module({
    imports: [ConfigModule, ApiKeyModule, JwtModule, EncrypterModule],
})
export class AppModule {}
