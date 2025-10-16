import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtConfig {
    constructor(private readonly config: ConfigService) {}

    get secret(): string {
        const secret = this.config.get<string>('JWT_SECRET');
        if (!secret) {
            throw new Error(
                'JWT_SECRET is not defined in environment variables',
            );
        }
        return secret;
    }

    get expiresIn(): string {
        const expiresIn = this.config.get<string>('JWT_EXPIRES_IN');
        if (!expiresIn) {
            throw new Error(
                'JWT_EXPIRES_IN is not defined in environment variables',
            );
        }
        return expiresIn;
    }
}
