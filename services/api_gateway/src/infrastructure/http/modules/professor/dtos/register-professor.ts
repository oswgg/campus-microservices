import {
    IsEmail,
    IsNotEmpty,
    IsString,
    MinLength,
    MaxLength,
} from 'class-validator';

export class RegisterProfessorDto {
    @IsNotEmpty({ message: 'Name is required' })
    @IsString({ message: 'Name must be a string' })
    @MinLength(2, { message: 'Name must be at least 2 characters long' })
    @MaxLength(100, { message: 'Name cannot exceed 100 characters' })
    name: string;
    @IsNotEmpty({ message: 'Institutional email is required' })
    @IsEmail({}, { message: 'Must be a valid email address' })
    institutionalEmail: string;

    @IsNotEmpty({ message: 'Password is required' })
    @IsString({ message: 'Password must be a string' })
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @MaxLength(50, { message: 'Password cannot exceed 50 characters' })
    institutionalPassword: string;
}
