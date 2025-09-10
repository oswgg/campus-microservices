import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AttendanceModule } from './attendance/attendance.module';

@Module({
    imports: [AuthModule, AttendanceModule],
})
export class AppModule {}
