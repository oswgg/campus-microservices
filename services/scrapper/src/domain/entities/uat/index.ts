import { ClassData } from '@campus/types';

export interface ClassDataWithSelector extends ClassData {
    selector: string;
}

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
