import { Module } from '@nestjs/common';
import { ProfessorModule } from './professor/professor.module';
import { ConfigModule } from './config/config.module';

@Module({
    imports: [ConfigModule, ProfessorModule],
})
export class AppModule {}
