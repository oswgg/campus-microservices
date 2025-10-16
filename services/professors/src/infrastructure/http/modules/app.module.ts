import { Module } from '@nestjs/common';
import { ProfessorsModule } from './professor/professor.module';
import { ConfigModule } from './config/config.module';

@Module({
    imports: [ConfigModule, ProfessorsModule],
})
export class AppModule {}
