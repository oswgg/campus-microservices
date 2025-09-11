export interface TakeAttendanceDto {
    profId: any;
    group: string;
    classroom: string;
    subject: string;
    period: number;
    date: string;
    students: { number: number; name: string; present: boolean }[];
}
