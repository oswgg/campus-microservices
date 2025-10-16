import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ConnectionsConfig {
    constructor(private readonly config: ConfigService) {}

    get mongoUrl() {
        const url = this.config.get<string>('MONGO_URL');
        if (!url) {
            throw new Error('MONGO_URL variable is not configured');
        }

        return url;
    }

    get rabbitUrl() {
        const url = this.config.get<string>('RABBIT_URL');
        if (!url) {
            throw new Error('RABBIT_URL variable is not configured');
        }

        return url;
    }
}
