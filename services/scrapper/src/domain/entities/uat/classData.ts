export interface ClassData {
    group: string;
    classroom: string;
    subject: string;
    period: number;
    students: {
        number: number;
        name: string;
    }[];
    selector: string;
}

export interface ProfessorClass extends Omit<ClassData, 'selector'> {}

export interface ClassWeek {
    weekNumber: number;
    startDate: string;
    endDate: string;
    selector: string;
}

export interface StudentInAttendanceTable {
    number: number;
    name: string;
    checkboxes: any[];
    selector: string;
}

export interface UATCredentials {
    username: string;
    password: string;
}
