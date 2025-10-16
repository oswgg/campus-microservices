import { Module } from '@nestjs/common';
import { EncrypterController } from './encrypter.controller';
import { ENCRYPTER_SERVICE_TOKEN } from '@/domain/services/encrypter';
import { EncrypterService } from '@/infrastructure/services/encrypter';

@Module({
    controllers: [EncrypterController],
    providers: [
        {
            provide: ENCRYPTER_SERVICE_TOKEN,
            useClass: EncrypterService,
        },
    ],
})
export class EncrypterModule {}
