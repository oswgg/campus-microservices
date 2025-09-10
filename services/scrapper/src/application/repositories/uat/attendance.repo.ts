import { ClassData, ProfessorClass, UATCredentials } from '@/domain/entities/uat/classData';

export interface AttendanceRepo {
    getProfessorClasses(credentials: UATCredentials): Promise<ProfessorClass[]>;
}

export const ATTENDANCE_REPO_TOKEN = Symbol('attendance.repo');
