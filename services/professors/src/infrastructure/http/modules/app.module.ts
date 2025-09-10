import { Module } from '@nestjs/common';
import { ProfessorsModule } from './professor/professor.module';

@Module({
    imports: [ProfessorsModule],
})
export class AppModule {}
