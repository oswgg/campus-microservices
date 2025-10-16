import { Inject, Injectable } from '@nestjs/common';
import {
    ADMIN_UAT_REPO_TOKEN,
    AdminUATRepo,
} from '../repositories/uat/admin/uat-admin.repo';
import { SERVICE_NAMES, TakeAttendanceDto } from '@campus/libs';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class TakeAttendance {
    constructor(
        @Inject(ADMIN_UAT_REPO_TOKEN)
        private readonly adminUATRepo: AdminUATRepo,
        @Inject(SERVICE_NAMES.PROFESSOR)
        private readonly professorClient: ClientProxy,
    ) {}

    async execute(data: TakeAttendanceDto): Promise<void> {
        try {
            await this.adminUATRepo.takeAttendance(data);

            this.professorClient.emit('professor.attendance_taken', data);
        } catch (error) {
            console.error('Error taking attendance:', error);
            throw error;
        }
    }
}
