import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SecurityConfig {
    constructor(private readonly config: ConfigService) {}

    get password_service_key(): string {
        const key = this.config.get<string>('PASSWORD_SERVICE_KEY');
        if (!key) {
            throw new Error(
                'PASSWORD_SERVICE_KEY is not defined in environment variables',
            );
        }
        return key;
    }
}
