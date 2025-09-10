import { Controller, Inject } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CreateProfessor } from '@/application/use-cases/create-professor';
import { RegisterProfessorEvent } from '@/domain/events/register.event';

@Controller()
export class AuthController {
    constructor(@Inject() private readonly createProfessor: CreateProfessor) {}

    @MessagePattern({ cmd: 'register' })
    async register(data: RegisterProfessorEvent) {
        return this.createProfessor.execute(data);
    }
}
