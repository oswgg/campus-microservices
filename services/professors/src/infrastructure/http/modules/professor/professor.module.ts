import { Module } from '@nestjs/common';
import { PROFESSOR_REPO_TOKEN } from '@/application/repositories/professor.repo';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SERVICE_NAMES } from '@campus/types';
import { DrizzleService } from '@/infrastructure/db/drizzle/drizzle.service';
import { MongoService } from '@/infrastructure/db/mongo/mongo.service';
import { ProfessorMongoRepoImpl } from '@/infrastructure/repositories/professor.mongo.repo.impl';
import { SaveProfessorClasses } from '@/application/use-cases/uat/save-professor-classes';
import { CreateProfessor } from '@/application/use-cases/uat/create-professor';
import { GetProfessorClasses } from '@/application/use-cases/uat/get-professors-classes';
import { ProfessorController } from './professor.controller';
import { TakeAttendance } from '@/application/use-cases/uat/take-attendance';

@Module({
    imports: [
        ClientsModule.register([
            {
                name: SERVICE_NAMES.SCRAPER,
                transport: Transport.RMQ,
                options: {
                    urls: [
                        process.env.RABBIT_URL ||
                            'amqp://oswgg:devOGG040520.dev@localhost:5672/',
                    ],
                    queue: 'scrapping_q',
                },
            },
        ]),
    ],
    providers: [
        DrizzleService,
        MongoService,
        {
            provide: PROFESSOR_REPO_TOKEN,
            useClass: ProfessorMongoRepoImpl,
        },
        CreateProfessor,
        SaveProfessorClasses,
        GetProfessorClasses,
        TakeAttendance,
    ],
    controllers: [ProfessorController],
})
export class ProfessorsModule {}
