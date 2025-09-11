import { config } from 'dotenv';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ProfessorController } from './professor.controller';
import { SERVICE_NAMES } from '@campus/types';

const envFile =
    process.env.NODE_ENV === 'production' ? '.env' : '.env.development';
config({ path: envFile });

@Module({
    imports: [
        ClientsModule.register([
            {
                name: SERVICE_NAMES.PROFESSOR,
                transport: Transport.RMQ,
                options: {
                    urls: [process.env.RABBIT_URL],
                    queue: 'professor_queue',
                },
            },
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
    controllers: [ProfessorController],
})
export class ProfessorModule {}
