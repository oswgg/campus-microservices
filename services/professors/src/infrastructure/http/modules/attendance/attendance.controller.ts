import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';

@Controller()
export class AttendanceController {
    @EventPattern('professor.getted_classes')
    async handleProfessorGettedClasses(data: any) {
        // Handle the event (e.g., process the data, update the database, etc.)
    }
}
