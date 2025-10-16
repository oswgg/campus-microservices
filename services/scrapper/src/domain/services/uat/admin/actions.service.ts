import { ClassData, TakeAttendanceDto } from '@campus/libs';

export interface AdminUATActionsService {
    getProfessorClasses(page: any): Promise<ClassData[]>;
    takeAttendance(
        page: any,
        data: Omit<TakeAttendanceDto, 'profId' | 'profEmail'>,
    ): Promise<void>;
}

export const ADMIN_UAT_ACTIONS_SERVICE_TOKEN = Symbol(
    'admin-uat-actions.service',
);
