import { Controller, Inject } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { RegisterProfessorEvent } from '@/domain/events/register.event';
import { ClassData } from '@campus/types';
import { CreateProfessor } from '@/application/use-cases/uat/create-professor';
import { SaveProfessorClasses } from '@/application/use-cases/uat/save-professor-classes';
import { GetProfessorClasses } from '@/application/use-cases/uat/get-professors-classes';

@Controller()
export class ProfessorController {
    constructor(
        private readonly createProfessor: CreateProfessor,
        private readonly saveProfessorClasses: SaveProfessorClasses,
        private readonly getProfessorClasses: GetProfessorClasses,
    ) {}

    @MessagePattern({ cmd: 'register' })
    async register(data: RegisterProfessorEvent) {
        return this.createProfessor.execute(data);
    }

    @MessagePattern({ cmd: 'get_classes' })
    async getClasses(data: { profId: string }) {
        return await this.getProfessorClasses.execute(data.profId);
    }

    @EventPattern('professor.getted_classes')
    async handleProfessorGettedClasses(data: {
        profId: string;
        classes: ClassData[];
    }) {
        console.log(
            'AttendanceController - professor.getted_classes event received:',
        );
        await this.saveProfessorClasses.execute(data.profId, data.classes);
    }
}
