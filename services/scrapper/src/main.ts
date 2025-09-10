import { config } from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from '@/infrastructure/http/modules/app.module';

// Load environment variables based on NODE_ENV
const envFile =
    process.env.NODE_ENV === 'production' ? '.env' : '.env.development';
config({ path: envFile });

async function bootstrap() {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(
        AppModule,
        {
            transport: Transport.RMQ,
            options: {
                queue: 'scrapping_q',
                urls: [process.env.RABBIT_URL],
                queueOptions: {
                    durable: true,
                },
                exchange: 'scrapping.exchange',
                exchangeType: 'direct',
            },
        },
    );
    await app.listen();
}

bootstrap();
