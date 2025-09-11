import { GetProfessorClasses } from '@/application/use-cases/get-professor-classes';
import { TakeAttendance } from '@/application/use-cases/take-attendace';
import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { TakeAttendanceForClassDto } from './dtos/take-attendance-for-class';

@Controller()
export class UatController {
    constructor(
        private readonly getProfessorClasses: GetProfessorClasses,
        private readonly takeAttendance: TakeAttendance,
    ) {}

    @EventPattern('professor.created')
    async handleProfessorCreated(data: {
        id: any;
        institutionalEmail: string;
        institutionalPassword: string;
    }) {
        console.log('Received professor.created event:', data);
        await this.getProfessorClasses.execute({
            id: data.id,
            username: data.institutionalEmail,
            password: data.institutionalPassword,
        });
    }

    @EventPattern('professor.take_attendance_for_class')
    async handleProfessorTakeAttendance(data: TakeAttendanceForClassDto) {
        await this.takeAttendance.execute(data);
    }
}
