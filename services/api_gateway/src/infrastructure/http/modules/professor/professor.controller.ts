import { SERVICE_NAMES } from '@campus/types';
import {
    Body,
    Controller,
    Inject,
    Post,
    HttpStatus,
    Get,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { RegisterProfessorDto } from './dtos/register-professor';

@Controller('professors')
export class ProfessorController {
    constructor(
        @Inject(SERVICE_NAMES.PROFESSOR)
        private readonly professorService: ClientProxy,
    ) {}

    @Post('register')
    async registerProfessor(@Body() body: RegisterProfessorDto) {
        try {
            await firstValueFrom(
                this.professorService.send({ cmd: 'register' }, body),
            );
            return {
                status: HttpStatus.CREATED,
                message: 'Professor registered successfully',
            };
        } catch (error) {
            return { error: 'Failed to register professor' };
        }
    }
}
