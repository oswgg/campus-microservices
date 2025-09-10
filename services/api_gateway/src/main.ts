import { config } from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './infrastructure/http/modules/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

// Load environment variables based on NODE_ENV
const envFile =
    process.env.NODE_ENV === 'production' ? '.env' : '.env.development';
config({ path: envFile });

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Global validation pipe
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true,
        }),
    );

    const config = new DocumentBuilder()
        .setTitle('Campus Microservices API Gateway')
        .setDescription('The Campus Microservices API Gateway Documentation')
        .setVersion('1.0')
        .addTag('Professors', 'Professor management endpoints')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    app.enableCors();

    const port = process.env.PORT;
    await app.listen(port);
}

bootstrap();
