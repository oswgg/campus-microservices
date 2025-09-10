import { Module } from '@nestjs/common';
import { ProfessorModule } from './professor/professor.module';

@Module({
    imports: [ProfessorModule],
})
export class AppModule {}
