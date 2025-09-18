import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { RegisterProfessorEvent } from '@/domain/events/register.event';
import { ClassData } from '@campus/types';
import { CreateProfessor } from '@/application/use-cases/uat/create-professor';
import { SaveProfessorClasses } from '@/application/use-cases/uat/save-professor-classes';
import { GetProfessorClasses } from '@/application/use-cases/uat/get-professors-classes';
import { TakeAttendanceDto } from './dtos/take-attendance';
import { TakeAttendance } from '@/application/use-cases/uat/take-attendance';
import { LoginProfessor } from '@/application/use-cases/uat/login-professor';

@Controller()
export class ProfessorController {
    constructor(
        private readonly createProfessor: CreateProfessor,
        private readonly saveProfessorClasses: SaveProfessorClasses,
        private readonly getProfessorClasses: GetProfessorClasses,
        private readonly takeAttendance: TakeAttendance,
        private readonly loginProfessor: LoginProfessor,
    ) {}

    @EventPattern('professor.register')
    async register(data: RegisterProfessorEvent) {
        return this.createProfessor.execute(data);
    }

    @MessagePattern('professor.login')
    async login(data: {
        institutionalEmail: string;
        institutionalPassword: string;
    }) {
        return await this.loginProfessor.execute(data);
    }

    @EventPattern('professor.get_classes')
    async getClasses(data: { profId: string }) {
        return await this.getProfessorClasses.execute(data.profId);
    }

    @EventPattern('professor.take_attendance_for_class')
    async handleTakeAttendance(data: TakeAttendanceDto) {
        return await this.takeAttendance.execute(data);
    }

    @EventPattern('professor.getted_classes')
    async handleProfessorGettedClasses(data: {
        profId: any;
        classes: ClassData[];
    }) {
        console.log('Received professor.getted_classes event:', data);
        await this.saveProfessorClasses.execute(data.profId, data.classes);
    }

    @EventPattern('professor.attendance_taken')
    async handleProfessorAttendanceTaken(data: any) {
        console.log('Attendance taken event received:', data);
        // Handle the event as needed
    }
}
