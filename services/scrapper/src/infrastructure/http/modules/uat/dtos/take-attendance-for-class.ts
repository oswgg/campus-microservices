export interface TakeAttendanceForClassDto {
    username: string;
    password: string;
    data: {
        group: string;
        classroom: string;
        subject: string;
        period: number;
        date: string;
        students: {
            number: number;
            name: string;
            present: boolean;
        }[];
    };
}
