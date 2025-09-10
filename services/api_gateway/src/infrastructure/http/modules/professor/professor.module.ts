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
                    port: SERVICE_PORTS.PROFESSOR,
                },
            },
        ]),
    ],
    controllers: [ProfessorController],
})
export class ProfessorModule {}
