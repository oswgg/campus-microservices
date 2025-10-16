import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './infrastructure/http/modules/app.module';
import { resolve } from 'path';
import { mkdirSync, writeFileSync } from 'fs';

function setupSecrets() {
    const secretsDir = resolve(
        process.env.NODE_ENV === 'production' ? '/app/secrets' : 'app/secrets', // Production = /app/secrets | Development = **/*/services/security/app/secrets
    );
    mkdirSync(secretsDir, { recursive: true });

    if (process.env.PRIVATE_KEY_B64) {
        const pem = Buffer.from(process.env.PRIVATE_KEY_B64, 'base64').toString(
            'utf8',
        );
        const keyPath = resolve(secretsDir, 'private.pem');
        writeFileSync(keyPath, pem, { mode: 0o600 }); // restrict permissions
        process.env.PRIVATE_KEY_PATH = keyPath;
    }
}
async function bootstrap() {
    setupSecrets();
    const micro = await NestFactory.createMicroservice<MicroserviceOptions>(
        AppModule,
        {
            transport: Transport.RMQ,
            options: {
                queue: 'security_queue',
                urls: [process.env.RABBIT_URL],
                queueOptions: { durable: true },
                exchange: 'security.exchange',
                exchangeType: 'direct',
            },
        },
    );
    await micro.listen();
}

bootstrap();
