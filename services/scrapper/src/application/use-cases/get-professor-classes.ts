import { SERVICE_NAMES } from '@campus/types';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ATTENDANCE_REPO_TOKEN, AttendanceRepo } from '../repositories/uat/attendance.repo';
import { UATCredentials } from '@/domain/entities/uat/classData';

export class GetProfessorClasses {
    constructor(
        @Inject(SERVICE_NAMES.PROFESSOR) private readonly professorService: ClientProxy,
        @Inject(ATTENDANCE_REPO_TOKEN) private readonly attendanceRepo: AttendanceRepo,
    ) {}

    async execute(crendential: UATCredentials) {
        const classes = await this.attendanceRepo.getProfessorClasses(crendential);

        this.professorService.emit('professor.getted_classes', { classes });
        return classes;
    }
}
