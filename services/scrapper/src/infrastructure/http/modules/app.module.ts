import { Module } from '@nestjs/common';
import { UatModule } from './uat/uat.module';
import { ConfigModule } from './config/config.module';

@Module({
    imports: [ConfigModule, UatModule],
})
export class AppModule {}
