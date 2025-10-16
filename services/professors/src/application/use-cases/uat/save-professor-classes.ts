import { ClassData } from '@campus/libs';
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

    async execute(profEmail: any, classes: ClassData[]) {
        await this.professorRepo.saveClasses(profEmail, classes);
        console.log(`Classes saved for professor ${profEmail}`);
    }
}
