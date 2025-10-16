import { SERVICE_NAMES } from '@campus/libs';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConnectionsConfig } from './config/connections.config';

@Module({
    imports: [
        ClientsModule.registerAsync([
            {
                name: SERVICE_NAMES.PROFESSOR,
                inject: [ConnectionsConfig],
                useFactory: (config: ConnectionsConfig) => ({
                    transport: Transport.RMQ,
                    options: {
                        urls: [config.rabbitUrl],
                        queue: 'professor_queue',
                    },
                }),
            },
            {
                name: SERVICE_NAMES.SECURITY,
                inject: [ConnectionsConfig],
                useFactory: (config: ConnectionsConfig) => ({
                    transport: Transport.RMQ,
                    options: {
                        urls: [config.rabbitUrl],
                        queue: 'security_queue',
                    },
                }),
            },
        ]),
    ],
    exports: [ClientsModule],
})
export class MicroservicesModule {}
