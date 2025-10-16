import {
    PROFESSOR_REPO_TOKEN,
    ProfessorRepository,
} from '@/application/repositories/professor.repo';
import {
    LoginProfessorDto,
    SERVICE_NAMES,
    UATCredentials,
    ValidateCredentialsResponse,
} from '@campus/libs';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class LoginProfessor {
    constructor(
        @Inject(PROFESSOR_REPO_TOKEN)
        private readonly professorRepo: ProfessorRepository,
        @Inject(SERVICE_NAMES.SCRAPER)
        private readonly scrapperService: ClientProxy,
    ) {}

    async execute(data: LoginProfessorDto): Promise<any> {
        const professor = await this.professorRepo.findByEmail(
            data.institutionalEmail,
        );

        if (!professor) {
            throw new Error('Professor not found');
        }

        const response = await firstValueFrom(
            this.scrapperService.send<
                ValidateCredentialsResponse,
                UATCredentials
            >(
                { cmd: 'professor.validate_credentials' },
                {
                    username: professor.institutionalEmail,
                    password: data.encryptedPassword,
                },
            ),
        );

        if (!response.success) {
            throw new BadRequestException('Invalid Credentials');
        }

        return professor;
    }
}
