import { SERVICE_NAMES, UATCredentials } from '@campus/types';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
    ATTENDANCE_REPO_TOKEN,
    AttendanceRepo,
} from '../repositories/uat/attendance.repo';

export class GetProfessorClasses {
    constructor(
        @Inject(SERVICE_NAMES.PROFESSOR)
        private readonly professorService: ClientProxy,
        @Inject(ATTENDANCE_REPO_TOKEN)
        private readonly attendanceRepo: AttendanceRepo,
    ) {}

    async execute(crendential: UATCredentials) {
        const classes =
            await this.attendanceRepo.getProfessorClasses(crendential);

        console.log(
            'GetProfessorClasses - About to emit event with classes:',
            classes,
        );

        // Emit the event (fire-and-forget)
        this.professorService.emit('professor.getted_classes', {
            profId: crendential.profId,
            classes,
        });

        console.log('GetProfessorClasses - Event emitted successfully');

        console.log('GetProfessorClasses - Classes fetched:', classes);
        return classes;
    }
}
