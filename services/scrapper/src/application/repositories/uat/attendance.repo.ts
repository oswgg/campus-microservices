import { ClassData, UATCredentials } from '@campus/types';

export interface AttendanceRepo {
    getProfessorClasses(credentials: UATCredentials): Promise<ClassData[]>;
}

export const ATTENDANCE_REPO_TOKEN = Symbol('attendance.repo');
