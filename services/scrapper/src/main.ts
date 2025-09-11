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

    // Dummy HTTP server just to satisfy Render port scan
    const app = express();
    app.get('/', (_, res) => res.send('OK'));
    app.listen(process.env.PORT || 3000);
}

bootstrap();
