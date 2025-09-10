import { Module } from '@nestjs/common';
import { UatController } from './uat.controller';
import { ATTENDANCE_REPO_TOKEN } from '@/application/repositories/uat/attendance.repo';
import { PuppeteerAttendanceRepo } from '@/infrastructure/services/uat/puppeteer.attendance.repo';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SERVICE_NAMES, SERVICE_PORTS } from '@campus/types';
import { GetProfessorClasses } from '@/application/use-cases/get-professor-classes';

@Module({
    imports: [
        ClientsModule.register([
            {
                name: SERVICE_NAMES.PROFESSOR,
                transport: Transport.RMQ,
                options: {
                    urls: [process.env.RABBIT_URL],
                    queue: 'professor_queue',
                },
            },
        ]),
    ],
    controllers: [UatController],
    providers: [
        GetProfessorClasses,
        {
            provide: ATTENDANCE_REPO_TOKEN,
            useClass: PuppeteerAttendanceRepo,
        },
    ],
})
export class UatModule {}
