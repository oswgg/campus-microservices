import { SERVICE_NAMES, UATCredentials } from '@campus/types';
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

    async execute(data: { id: string; username: string; password: string }) {
        const classes = await this.attendanceRepo.getProfessorClasses({
            id: data.id,
            username: data.username,
            password: data.password,
        });

        this.professorService.emit('professor.getted_classes', {
            profId: data.id,
            classes,
        });

        console.log('Emitted professor.getted_classes event');

        return classes;
    }
}
