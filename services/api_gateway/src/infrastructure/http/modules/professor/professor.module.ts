import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ProfessorController } from './professor.controller';
import { SERVICE_NAMES, SERVICE_PORTS } from '@campus/types';

@Module({
    imports: [
        ClientsModule.register([
            {
                name: SERVICE_NAMES.PROFESSOR,
                transport: Transport.TCP,
                options: {
                    host: process.env.PROFESSOR_HOST,
                    port: Number(process.env.PROFESSORS_PORT) || 4352,
                },
            },
            {
                name: SERVICE_NAMES.SCRAPER,
                transport: Transport.RMQ,
                options: {
                    urls: [
                        process.env.RABBITMQ_URL ||
                            'amqp://oswgg:devOGG040520.dev@localhost:5672/',
                    ],
                    queue: 'scrapping_q',
                },
            },
        ]),
    ],
    controllers: [ProfessorController],
})
export class ProfessorModule {}
