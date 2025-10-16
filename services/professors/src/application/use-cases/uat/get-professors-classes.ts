import {
    PROFESSOR_REPO_TOKEN,
    ProfessorRepository,
} from '@/application/repositories/professor.repo';
import { Inject } from '@nestjs/common';

export class GetProfessorClasses {
    constructor(
        @Inject(PROFESSOR_REPO_TOKEN)
        private readonly professorRepo: ProfessorRepository,
    ) {}

    async execute(profId: any) {
        const professor = await this.professorRepo.findById(profId);

        if (!professor) {
            throw new Error('Professor not found');
        }

        return await this.professorRepo.getClasses(professor.id);
    }
}
