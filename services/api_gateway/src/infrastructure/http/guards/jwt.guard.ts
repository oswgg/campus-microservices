import {
    CanActivate,
    ExecutionContext,
    Inject,
    Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { APP_ACCESS_KEY } from './app-access.decorator';
import {
    TOKEN_SERVICE_TOKEN,
    TokenService,
} from '@/application/services/token.service';
import { PUBLIC_ROUTE_KEY } from './public-routes.decorator';
import { AccessPayload } from '@/domain/access.payload';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(
        @Inject(TOKEN_SERVICE_TOKEN)
        private readonly jwtService: TokenService,
        private reflector: Reflector,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const publicRoute = this.reflector.get(
            PUBLIC_ROUTE_KEY,
            context.getHandler(),
        );

        if (publicRoute) {
            return true;
        }

        const requiredApp = this.reflector.get(
            APP_ACCESS_KEY,
            context.getClass(),
        );

        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) return false;

        try {
            const payload: AccessPayload = await this.jwtService.verify(token);
            if (requiredApp && payload.app !== requiredApp) {
                return false;
            }
            request.user = payload;
        } catch (error) {
            console.log(error);
            return false;
        }

        return true;
    }

    private extractTokenFromHeader(request: Request): string | null {
        const authHeader = request.headers['authorization'];
        if (!authHeader) return null;

        const [type, token] = authHeader.split(' ');
        return type === 'Bearer' ? token : null;
    }
}
