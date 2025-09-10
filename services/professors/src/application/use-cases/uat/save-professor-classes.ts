import { ClassData } from '@campus/types';
import { Inject } from '@nestjs/common';
import {
    PROFESSOR_REPO_TOKEN,
    ProfessorRepository,
} from '@/application/repositories/professor.repo';

export class SaveProfessorClasses {
    constructor(
        @Inject(PROFESSOR_REPO_TOKEN)
        private readonly professorRepo: ProfessorRepository,
    ) {}

    async execute(profId: any, classes: ClassData[]) {
        await this.professorRepo.saveClasses(profId, classes);
    }
}
