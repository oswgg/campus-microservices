import { Module } from '@nestjs/common';
import { AuthController } from '@/infrastructure/http/modules/auth/auth.controller';
import { DrizzleService } from '@/infrastructure/db/drizzle.service';
import { PROFESSOR_REPO_TOKEN } from '@/application/repositories/professor.repo';
import { ProfessorRepoImpl } from '@/infrastructure/repositories/professor.repo.impl';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CreateProfessor } from '@/application/use-cases/create-professor';
import { SERVICE_NAMES } from '@campus/types';

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
                    queueOptions: {
                        durable: true,
                    },
                    exchange: 'scrapping.exchange',
                    exchangeType: 'direct',
                },
            },
        ]),
    ],
    controllers: [AuthController],
    providers: [
        DrizzleService,
        {
            provide: PROFESSOR_REPO_TOKEN,
            useClass: ProfessorRepoImpl,
        },
        CreateProfessor,
    ],
})
export class AuthModule {}
