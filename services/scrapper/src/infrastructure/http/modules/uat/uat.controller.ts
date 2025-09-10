import { GetProfessorClasses } from '@/application/use-cases/get-professor-classes';
import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';

@Controller('uat')
export class UatController {
    constructor(private readonly getProfessorClasses: GetProfessorClasses) {}

    @EventPattern('professor.created')
    async handleProfessorCreated(data: any) {
        await this.getProfessorClasses.execute({
            profId: data.id,
            username: data.institutionalEmail,
            password: data.institutionalPassword,
        });
    }
}
