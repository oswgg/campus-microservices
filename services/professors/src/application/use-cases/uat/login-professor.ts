import {
    PROFESSOR_REPO_TOKEN,
    ProfessorRepository,
} from '@/application/repositories/professor.repo';
import { PASSWORD_SERVICE_TOKEN, PasswordService } from '@campus/libs';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class LoginProfessor {
    constructor(
        @Inject(PROFESSOR_REPO_TOKEN)
        private readonly professorRepo: ProfessorRepository,
        @Inject(PASSWORD_SERVICE_TOKEN)
        private readonly passwordService: PasswordService,
    ) {}

    async execute(data: {
        institutionalEmail: string;
        institutionalPassword: string;
    }): Promise<any> {
        const professor = await this.professorRepo.findByEmail(
            data.institutionalEmail,
        );

        if (!professor) {
            throw new Error('Professor not found');
        }

        const isValid = await this.passwordService.compare(
            data.institutionalPassword,
            professor.institutionalPassword,
        );

        if (!isValid) {
            throw new Error('Invalid credentials');
        }

        return professor;
    }
}
