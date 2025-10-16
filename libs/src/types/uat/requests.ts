interface EncryptedPasswordPresent {
    encryptedPassword: string;
}

export interface LoginProfessorDto extends EncryptedPasswordPresent {
    institutionalEmail: string;
}

export interface TakeAttendanceDto extends EncryptedPasswordPresent {
    profId: any;
    profEmail: string;
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
}

export interface RegisterProfessorDto extends EncryptedPasswordPresent {
    name: string;
    institutionalEmail: string;
}

export type UATCredentials = {
    username: string;
    password: string;
};
