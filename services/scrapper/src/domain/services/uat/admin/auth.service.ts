import { UATCredentials } from '@campus/types';

export interface AdminUATAuthService {
    login(page: any, credentials: UATCredentials): Promise<void>;
}

export const ADMIN_UAT_AUTH_SERVICE_TOKEN = Symbol('admin-uat-auth.service');
