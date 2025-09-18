import { UATCredentials } from '@campus/libs';

export interface AdminUATAuthService {
    login(
        page: any,
        credentials: UATCredentials,
    ): Promise<{ success: boolean; message: string }>;
}

export const ADMIN_UAT_AUTH_SERVICE_TOKEN = Symbol('admin-uat-auth.service');
