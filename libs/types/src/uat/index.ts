export interface ClassData {
    group: string;
    classroom: string;
    subject: string;
    period: number;
    students: {
        number: number;
        name: string;
    }[];
}

export interface RegisterProfessorInput {
    name: string;
    institutionalEmail: string;
    institutionalPassword: string;
}

export interface RegisterProfessorOutput {
    id: any;
    name: string;
    email: string;
    token: any;
}

export type UATCredentials = {
    username: string;
    password: string;
};
