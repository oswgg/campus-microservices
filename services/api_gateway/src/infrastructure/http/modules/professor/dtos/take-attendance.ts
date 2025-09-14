import { ApiProperty } from '@nestjs/swagger';
import {
    IsNotEmpty,
    IsNumber,
    IsString,
    MaxLength,
    MinLength,
} from 'class-validator';

export class TakeAttendanceDto {
    @ApiProperty({
        example: 'G',
        description: 'Grupo de la clase',
        minLength: 1,
        maxLength: 1,
    })
    @IsNotEmpty({ message: 'Group is required' })
    @IsString({ message: 'Group must be a string' })
    @MinLength(1, { message: 'Group must be at least 1 character long' })
    @MaxLength(1, { message: 'Group cannot exceed 1 character' })
    group: string;

    @ApiProperty({
        example: 'D-409',
        description: 'Aula donde se imparte la clase',
        minLength: 1,
        maxLength: 10,
    })
    @IsNotEmpty({ message: 'Classroom is required' })
    @IsString({ message: 'Classroom must be a string' })
    @MinLength(1, { message: 'Classroom must be at least 1 character long' })
    @MaxLength(10, { message: 'Classroom cannot exceed 10 characters' })
    classroom: string;

    @ApiProperty({
        example: '(RC.06061.2870.5-5) ESTRUCTURAS DE DATOS',
        description: 'Asignatura de la clase',
        minLength: 5,
        maxLength: 100,
    })
    @IsNotEmpty({ message: 'Subject is required' })
    @IsString({ message: 'Subject must be a string' })
    @MinLength(5, { message: 'Subject must be at least 5 characters long' })
    @MaxLength(100, { message: 'Subject cannot exceed 100 characters' })
    subject: string;

    @ApiProperty({
        example: 3,
        description: 'Periodo de la clase',
    })
    @IsNotEmpty({ message: 'Period is required' })
    @IsNumber({}, { message: 'Period must be a number' })
    period: number;

    @ApiProperty({
        example: '2024-04-15',
        description: 'Fecha de la clase en formato YYYY-MM-DD',
    })
    @IsNotEmpty({ message: 'Date is required' })
    @IsString({ message: 'Date must be a string in format YYYY-MM-DD' })
    @MinLength(10, { message: 'Date must be in format YYYY-MM-DD' })
    @MaxLength(10, { message: 'Date must be in format YYYY-MM-DD' })
    date: string;

    @ApiProperty({
        example: [
            { number: 1, name: 'CERVANTES MORAN JORGE AIRAM', present: true },
            { number: 2, name: 'LOPEZ PEREZ ANA MARIA', present: false },
        ],
        description: 'Lista de estudiantes con su asistencia',
    })
    @IsNotEmpty({ message: 'Students attendance list is required' })
    students: {
        number: number;
        name: string;
        present: boolean;
    }[];
}
