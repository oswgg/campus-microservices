import {
    ENCRYPTER_SERVICE_TOKEN,
    IEncrypterService,
} from '@/domain/services/encrypter';
import { Controller, Inject } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class EncrypterController {
    constructor(
        @Inject(ENCRYPTER_SERVICE_TOKEN)
        private readonly encrypterService: IEncrypterService,
    ) {}

    @MessagePattern({ cmd: 'encrypter.decrypt' })
    decrypt(encrypted: string) {
        return this.encrypterService.decrypt(encrypted);
    }
}
