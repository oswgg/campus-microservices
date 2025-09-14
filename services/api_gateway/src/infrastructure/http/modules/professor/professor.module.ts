import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ProfessorController } from './professor.controller';
import { SERVICE_NAMES } from '@campus/types';
import { ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TOKEN_SERVICE_TOKEN } from '@/application/services/token.service';
import { NestJwtService } from '@/infrastructure/services/jwt.nest';

@Module({
    imports: [
        ClientsModule.registerAsync([
            {
                name: SERVICE_NAMES.PROFESSOR,
                inject: [ConfigService],
                useFactory: (config: ConfigService) => ({
                    transport: Transport.RMQ,
                    options: {
                        urls: [config.get<string>('RABBIT_URL')],
                        queue: 'professor_queue',
                    },
                }),
            },
            {
                name: SERVICE_NAMES.SCRAPER,
                inject: [ConfigService],
                useFactory: (config: ConfigService) => ({
                    transport: Transport.RMQ,
                    options: {
                        urls: [config.get<string>('RABBIT_URL')],
                        queue: 'scrapping_q',
                    },
                }),
            },
        ]),
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                secret: config.get<string>('JWT_SECRET'),
                signOptions: { expiresIn: '24h' },
            }),
        }),
    ],
    providers: [
        {
            provide: TOKEN_SERVICE_TOKEN,
            inject: [JwtService],
            useFactory: (service) => new NestJwtService(service),
        },
    ],
    controllers: [ProfessorController],
})
export class ProfessorModule {}
