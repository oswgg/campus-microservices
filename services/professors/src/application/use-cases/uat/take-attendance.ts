import {
    PROFESSOR_REPO_TOKEN,
    ProfessorRepository,
} from '@/application/repositories/professor.repo';
import { TakeAttendanceDto } from '@/infrastructure/http/modules/professor/dtos/take-attendance';
import { SERVICE_NAMES } from '@campus/types';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class TakeAttendance {
    constructor(
        @Inject(SERVICE_NAMES.SCRAPER)
        private readonly scrapperService: ClientProxy,
        @Inject(PROFESSOR_REPO_TOKEN)
        private readonly professorRepo: ProfessorRepository,
    ) {}

    async execute(data: TakeAttendanceDto) {
        const professor = await this.professorRepo.findById(data.profId);
        if (!professor) {
            throw new Error('Professor not found');
        }

        this.scrapperService.emit('professor.take_attendance_for_class', {
            username: professor.institutionalEmail,
            password: professor.institutionalPassword,
            data: {
                group: data.group,
                classroom: data.classroom,
                subject: data.subject,
                period: data.period,
                date: data.date,
                students: data.students,
            },
        });

        return { message: 'Take attendance process initiated' };
    }
}
