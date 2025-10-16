import { Module } from '@nestjs/common';
import { ApiKeyController } from './api-key.controller';

@Module({
    controllers: [ApiKeyController],
})
export class ApiKeyModule {}
