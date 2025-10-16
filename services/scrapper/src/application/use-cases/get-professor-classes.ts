import { SERVICE_NAMES, UATCredentials } from '@campus/libs';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
    ADMIN_UAT_REPO_TOKEN,
    AdminUATRepo,
} from '../repositories/uat/admin/uat-admin.repo';

@Injectable()
export class GetProfessorClasses {
    constructor(
        @Inject(SERVICE_NAMES.PROFESSOR)
        private readonly professorService: ClientProxy,
        @Inject(ADMIN_UAT_REPO_TOKEN)
        private readonly attendanceRepo: AdminUATRepo,
    ) {}

    async execute(data: UATCredentials) {
        const classes = await this.attendanceRepo.getProfessorClasses(data);

        this.professorService.emit('professor.getted_classes', {
            profEmail: data.username,
            classes,
        });

        console.log('Emitted professor.getted_classes event');

        return classes;
    }
}
