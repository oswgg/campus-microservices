import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class JwtController {
    @MessagePattern({ cmd: 'jwt.generate' })
    generateToken(data: any) {}

    @MessagePattern({ cmd: 'jwt.verify' })
    verifyToken(token: string) {}

    @MessagePattern({ cmd: 'jwt.decode' })
    decodeToken(token: string) {}

    @MessagePattern({ cmd: 'jwt.refresh' })
    refreshToken(token: string) {}

    @MessagePattern({ cmd: 'jwt.invalidate' })
    invalidateToken(token: string) {}
}
