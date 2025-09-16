import { ClassData, UATCredentials } from '@campus/types';

export interface AdminUATRepo {
    validateCredentials(
        data: UATCredentials,
    ): Promise<{ success: boolean; message: string }>;

    getProfessorClasses(
        credentials: UATCredentials & { id: any },
    ): Promise<ClassData[]>;
    takeAttendance(data: {
        username: string;
        password: string;
        data: {
            group: string;
            classroom: string;
            subject: string;
            period: number;
            date: string;
            students: {
                number: number;
                name: string;
                present: boolean;
            }[];
        };
    }): Promise<void>;
}

export const ADMIN_UAT_REPO_TOKEN = Symbol('admin_uat.repo');
