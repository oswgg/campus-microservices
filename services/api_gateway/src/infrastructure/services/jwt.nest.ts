import { TokenService } from '@/application/services/token.service';
import { AccessPayload } from '@/domain/access.payload';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class NestJwtService implements TokenService {
    constructor(private readonly service: JwtService) {}

    sign(payload: Record<string, any>): string | Promise<string> {
        return this.service.sign(payload);
    }

    verify(
        token: string,
    ):
        | (AccessPayload & Record<string, any>)
        | Promise<AccessPayload & Record<string, any>> {
        return this.service.verifyAsync(token);
    }
}
