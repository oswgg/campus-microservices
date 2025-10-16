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

export interface RegisterProfessorOutput {
    id: any;
    name: string;
    email: string;
    token: any;
}

export interface ValidateCredentialsResponse {
    success: boolean;
    message: string;
}
