import { Module } from '@nestjs/common';
import { ProfessorController } from './professor.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TOKEN_SERVICE_TOKEN } from '@/application/services/token.service';
import { NestJwtService } from '@/infrastructure/services/jwt.nest';
import { JwtConfig } from '../config/jwt.config';
import { MicroservicesModule } from '../microservices.module';

@Module({
    imports: [
        MicroservicesModule,
        JwtModule.registerAsync({
            inject: [JwtConfig],
            useFactory: (jwtConfig: JwtConfig) => ({
                secret: jwtConfig.secret,
                signOptions: { expiresIn: jwtConfig.expiresIn },
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
