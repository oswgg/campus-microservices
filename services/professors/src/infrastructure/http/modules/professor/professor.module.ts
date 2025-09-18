import { config } from 'dotenv';
import { Module } from '@nestjs/common';
import { PROFESSOR_REPO_TOKEN } from '@/application/repositories/professor.repo';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SERVICE_NAMES, PASSWORD_SERVICE_TOKEN } from '@campus/types';
import { CampusPasswordService } from '@campus/packages';
import { DrizzleService } from '@/infrastructure/db/drizzle/drizzle.service';
import { MongoService } from '@/infrastructure/db/mongo/mongo.service';
import { ProfessorMongoRepoImpl } from '@/infrastructure/repositories/professor.mongo.repo.impl';
import { SaveProfessorClasses } from '@/application/use-cases/uat/save-professor-classes';
import { CreateProfessor } from '@/application/use-cases/uat/create-professor';
import { GetProfessorClasses } from '@/application/use-cases/uat/get-professors-classes';
import { ProfessorController } from './professor.controller';
import { TakeAttendance } from '@/application/use-cases/uat/take-attendance';
import { LoginProfessor } from '@/application/use-cases/uat/login-professor';

const envFile =
    process.env.NODE_ENV === 'production' ? '.env' : '.env.development';
config({ path: envFile });
@Module({
    imports: [
        ClientsModule.register([
            {
                name: SERVICE_NAMES.SCRAPER,
                transport: Transport.RMQ,
                options: {
                    urls: [process.env.RABBIT_URL],
                    queue: 'scrapping_q',
                },
            },
        ]),
    ],
    providers: [
        DrizzleService,
        MongoService,

        {
            provide: PASSWORD_SERVICE_TOKEN,
            useFactory: () => {
                return new CampusPasswordService();
            },
        },
        {
            provide: PROFESSOR_REPO_TOKEN,
            useClass: ProfessorMongoRepoImpl,
        },
        CreateProfessor,
        SaveProfessorClasses,
        GetProfessorClasses,
        TakeAttendance,
        LoginProfessor,
    ],
    controllers: [ProfessorController],
})
export class ProfessorsModule {}
