import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
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
    providers: [ConnectionsConfig],
    exports: [ConnectionsConfig],
})
export class ConfigModule {}
