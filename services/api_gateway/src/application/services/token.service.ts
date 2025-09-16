import { AccessPayload } from '@/domain/access.payload';

export interface TokenService {
    sign(
        payload: AccessPayload & Record<string, any>,
    ): string | Promise<string>;
    verify(
        token: string,
    ):
        | (AccessPayload & Record<string, any>)
        | Promise<AccessPayload & Record<string, any>>;
}

export const TOKEN_SERVICE_TOKEN = Symbol('token.service');
