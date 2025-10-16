import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './infrastructure/http/modules/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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
    app.enableCors();

    const swaggerConfig = new DocumentBuilder()
        .setTitle('Campus Microservices API Gateway')
        .setDescription('API Gateway for Campus Microservices')
        .setVersion('1.0')
        .addTag('campus')
        .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api', app, document, {
        swaggerOptions: {
            persistAuthorization: true,
        },
        customSiteTitle: 'Campus API Gateway Docs',
        customfavIcon: '/favicon.ico',
        customJs: [
            'https://unpkg.com/swagger-ui-dist@5.7.2/swagger-ui-bundle.js',
            'https://unpkg.com/swagger-ui-dist@5.7.2/swagger-ui-standalone-preset.js',
        ],
        customCssUrl: [
            'https://unpkg.com/swagger-ui-dist@5.7.2/swagger-ui.css',
        ],
    });

    const port = process.env.PORT;
    await app.listen(port);
}

bootstrap();
