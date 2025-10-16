import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ConnectionsConfig {
    constructor(private readonly config: ConfigService) {}

    get rabbitUrl(): string {
        const uri = this.config.get<string>('RABBIT_URL');
        if (!uri) {
            throw new Error(
                'RABBIT_URL is not defined in environment variables',
            );
        }
        return uri;
    }

    get mongoUrl(): string {
        const uri = this.config.get<string>('MONGO_URL');
        if (!uri) {
            throw new Error(
                'MONGO_URL is not defined in environment variables',
            );
        }
        return uri;
    }
}
