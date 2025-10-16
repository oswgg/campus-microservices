import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { JwtConfig } from './jwt.config';
import { SecurityConfig } from './security.config';
import { ConnectionsConfig } from './connections.config';

@Global()
@Module({
    imports: [
        NestConfigModule.forRoot({
            isGlobal: true,
            envFilePath:
                process.env.NODE_ENV === 'production'
                    ? '.env'
                    : '.env.development',
        }),
    ],
    providers: [JwtConfig, SecurityConfig, ConnectionsConfig],
    exports: [JwtConfig, SecurityConfig, ConnectionsConfig],
})
export class ConfigModule {}
