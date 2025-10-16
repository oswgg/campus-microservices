import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './infrastructure/http/modules/app.module';

async function bootstrap() {
    // TCP microservice
    const tcpApp = await NestFactory.createMicroservice<MicroserviceOptions>(
        AppModule,
        {
            transport: Transport.TCP,
            options: {
                host: process.env.HOST,
                port: Number(process.env.PORT),
            },
        },
    );

    // RMQ microservice
    const rmqApp = await NestFactory.createMicroservice<MicroserviceOptions>(
        AppModule,
        {
            transport: Transport.RMQ,
            options: {
                urls: [process.env.RABBIT_URL],
                queue: 'professor_queue',
                queueOptions: { durable: true },
            },
        },
    );

    await Promise.all([tcpApp.listen(), rmqApp.listen()]);
}

bootstrap();
