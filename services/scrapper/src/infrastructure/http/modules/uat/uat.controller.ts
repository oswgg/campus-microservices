import { GetProfessorClasses } from '@/application/use-cases/get-professor-classes';
import { TakeAttendance } from '@/application/use-cases/take-attendace';
import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { TakeAttendanceDto, UATCredentials } from '@campus/libs';
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
        console.log('Validating credentials:');
        return await this.validateCredentials.execute(data);
    }

    @EventPattern('professor.created')
    async handleProfessorCreated(data: UATCredentials) {
        console.log('Received professor.created event:');
        await this.getProfessorClasses.execute(data);
    }

    @EventPattern('professor.take_attendance_for_class')
    async handleProfessorTakeAttendance(data: TakeAttendanceDto) {
        await this.takeAttendance.execute(data);
    }
}
