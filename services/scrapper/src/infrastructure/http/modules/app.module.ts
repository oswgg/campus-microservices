import { Module } from '@nestjs/common';
import { UatModule } from './uat/uat.module';

@Module({
    imports: [UatModule],
})
export class AppModule {}
