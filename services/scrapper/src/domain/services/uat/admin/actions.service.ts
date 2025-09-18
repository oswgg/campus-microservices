import { ClassData } from '@campus/libs';

export interface AdminUATActionsService {
    getProfessorClasses(page: any): Promise<ClassData[]>;
    takeAttendance(
        page: any,
        data: ClassData & {
            date: string;
            students: { number: number; name: string; present: boolean }[];
        },
    ): Promise<void>;
}

export const ADMIN_UAT_ACTIONS_SERVICE_TOKEN = Symbol(
    'admin-uat-actions.service',
);
