import { GetProfessorClasses } from '@/application/use-cases/get-professor-classes';
import { TakeAttendance } from '@/application/use-cases/take-attendace';
import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { TakeAttendanceForClassDto } from './dtos/take-attendance-for-class';
import { UATCredentials } from '@campus/types';
import { ValidateCredentials } from '@/application/use-cases/validate-credentials';

@Controller()
export class UatController {
    constructor(
        private readonly getProfessorClasses: GetProfessorClasses,
        private readonly takeAttendance: TakeAttendance,
        private readonly validateCredentials: ValidateCredentials,
    ) {}

    @MessagePattern({ cmd: 'professor.validate_credentials' })
    async handleValidateCredentials(data: UATCredentials) {
        console.log('Validating credentials:', data);
        return await this.validateCredentials.execute(data);
    }

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
