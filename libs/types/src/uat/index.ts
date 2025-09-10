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

export type UATCredentials = {
    profId: string;
    username: string;
    password: string;
};
