import { config } from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from '@/infrastructure/http/modules/app.module';
import * as express from 'express';

const envFile =
    process.env.NODE_ENV === 'production' ? '.env' : '.env.development';
config({ path: envFile });

async function bootstrap() {
    const micro = await NestFactory.createMicroservice<MicroserviceOptions>(
        AppModule,
        {
            transport: Transport.RMQ,
            options: {
                queue: 'scrapping_q',
                urls: [process.env.RABBIT_URL],
                queueOptions: { durable: true },
                exchange: 'scrapping.exchange',
                exchangeType: 'direct',
            },
        },
    );
    await micro.listen();

    // 🟢 Servidor HTTP fantasma para Render
    const dummy = express();
    dummy.get('/', (_, res) => res.send('OK'));
    dummy.listen(Number(process.env.PORT) || 3000, '0.0.0.0', () => {
        console.log(
            `Dummy HTTP server listening on port ${process.env.PORT || 3000}`,
        );
    });
}

bootstrap();
