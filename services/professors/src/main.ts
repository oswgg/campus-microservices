import { config } from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './infrastructure/http/modules/app.module';
import { SERVICE_PORTS } from '@campus/types';

// Load environment variables based on NODE_ENV
const envFile =
    process.env.NODE_ENV === 'production' ? '.env' : '.env.development';
config({ path: envFile });

async function bootstrap() {
    const tcpApp = await NestFactory.createMicroservice<MicroserviceOptions>(
        AppModule,
        {
            transport: Transport.TCP,
            options: {
                host: '0.0.0.0',
                port: SERVICE_PORTS.PROFESSOR,
            },
        },
    );

    const rmqApp = await NestFactory.createMicroservice<MicroserviceOptions>(
        AppModule,
        {
            transport: Transport.RMQ,
            options: {
                urls: [process.env.RABBIT_URL],
                queue: 'professor_queue',
                queueOptions: {
                    durable: true,
                },
            },
        },
    );

    await Promise.all([tcpApp.listen(), rmqApp.listen()]);
}

bootstrap();
