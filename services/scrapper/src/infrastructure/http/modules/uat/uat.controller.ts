import { GetProfessorClasses } from '@/application/use-cases/get-professor-classes';
import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';

@Controller('uat')
export class UatController {
    constructor(private readonly getProfessorClasses: GetProfessorClasses) {}

    @EventPattern('professor.created')
    async handleProfessorCreated(data: any) {
        try {
            const result = await this.getProfessorClasses.execute({
                username: data.institutionalEmail,
                password: data.institutionalPassword,
            });

            return result;
        } catch (error) {
            console.error(
                '❌ Error processing professor.created event:',
                error,
            );
            throw error;
        }
    }
}
