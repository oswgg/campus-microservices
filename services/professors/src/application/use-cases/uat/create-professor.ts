import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { RegisterProfessorEvent } from '@/domain/events/register.event';
import { Professor } from '@/domain/entities/professor.entity';
import { SERVICE_NAMES } from '@campus/types';
import {
    PROFESSOR_REPO_TOKEN,
    ProfessorRepository,
} from '@/application/repositories/professor.repo';
import { firstValueFrom } from 'rxjs';

export class CreateProfessor {
    constructor(
        @Inject(PROFESSOR_REPO_TOKEN)
        private readonly professorRepo: ProfessorRepository,
        @Inject(SERVICE_NAMES.SCRAPER)
        private readonly scrappingService: ClientProxy,
    ) {}

    async execute(data: RegisterProfessorEvent) {
        // Business logic to create a professor
        const professor = await this.professorRepo.findByEmail(
            data.institutionalEmail,
        );
        if (professor) {
            throw new Error('Professor with this email already exists');
        }

        const validCredentials = await firstValueFrom(
            this.scrappingService.send(
                { cmd: 'professor.validate_credentials' },
                {
                    username: data.institutionalEmail,
                    password: data.institutionalPassword,
                },
            ),
        );

        if (!validCredentials.success) {
            throw new Error(`Invalid credentials: ${validCredentials.message}`);
        }

        const newProfessor = await this.professorRepo.create(
            new Professor(
                0,
                data.name,
                data.institutionalEmail,
                data.institutionalPassword,
            ),
        );

        const eventData = {
            id: newProfessor.id,
            name: newProfessor.name,
            institutionalEmail: newProfessor.institutionalEmail,
            institutionalPassword: newProfessor.institutionalPassword,
        };

        try {
            this.scrappingService.emit('professor.created', eventData);
        } catch (error) {
            console.error('Error emitting professor.created event:', error);
        }

        return newProfessor;
    }
}
