import {
    ClassData,
    TakeAttendanceDto,
    UATCredentials,
    ValidateCredentialsResponse,
} from '@campus/libs';

export interface AdminUATRepo {
    validateCredentials(
        data: UATCredentials,
    ): Promise<ValidateCredentialsResponse>;

    getProfessorClasses(credentials: UATCredentials): Promise<ClassData[]>;
    takeAttendance(data: TakeAttendanceDto): Promise<void>;
}

export const ADMIN_UAT_REPO_TOKEN = Symbol('admin_uat.repo');
