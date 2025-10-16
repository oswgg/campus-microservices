import { CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { firstValueFrom } from 'rxjs';
import { APP_ACCESS_KEY } from './app-access.decorator';
import { ClientProxy } from '@nestjs/microservices';
import { SERVICE_NAMES } from '@campus/libs';
import { PUBLIC_ROUTE_KEY } from './public-routes.decorator';

export class ApiKeyAuthGuard implements CanActivate {
    constructor(
        @Inject(SERVICE_NAMES.SECURITY)
        private readonly securityService: ClientProxy,
        private readonly reflector: Reflector,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.get(
            PUBLIC_ROUTE_KEY,
            context.getHandler(),
        );

        if (isPublic) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const apiKey = this.extractApiKeyFromHeader(request);

        if (!apiKey) return false;

        const app = this.reflector.get<string>(
            APP_ACCESS_KEY,
            context.getClass(),
        );

        try {
            const response = await firstValueFrom<{
                valid: boolean;
                apiKey: string;
                app: string;
            }>(
                this.securityService.send(
                    {
                        cmd: 'api-key.verify',
                    },
                    { api_key: apiKey, required_app: app },
                ),
            );

            if (!response.valid) {
                return false;
            }
        } catch (error) {
            console.log(error);
            return false;
        }

        return true;
    }

    private extractApiKeyFromHeader(request: Request): string | null {
        const apiKeyHeader = request.headers['x-api-key'];
        if (!apiKeyHeader) return null;
        if (Array.isArray(apiKeyHeader)) return apiKeyHeader[0];
        return apiKeyHeader;
    }
}
