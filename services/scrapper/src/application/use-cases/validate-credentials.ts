import { Inject, Injectable } from '@nestjs/common';
import {
    ADMIN_UAT_REPO_TOKEN,
    AdminUATRepo,
} from '../repositories/uat/admin/uat-admin.repo';
import { UATCredentials } from '@campus/types';

@Injectable()
export class ValidateCredentials {
    constructor(
        @Inject(ADMIN_UAT_REPO_TOKEN)
        private readonly adminUatRepo: AdminUATRepo,
    ) {}

    async execute(data: UATCredentials) {
        return await this.adminUatRepo.validateCredentials(data);
    }
}
