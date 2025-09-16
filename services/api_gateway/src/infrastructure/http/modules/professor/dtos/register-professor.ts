import { RegisterProfessorInput } from '@campus/types';
import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
    IsNotEmpty,
    IsString,
    MinLength,
    MaxLength,
} from 'class-validator';

export class RegisterProfessorDto implements RegisterProfessorInput {
    @ApiProperty({
        example: 'Dr. María González',
        description: 'The full name of the professor',
        minLength: 2,
        maxLength: 100,
    })
    @IsNotEmpty({ message: 'Name is required' })
    @IsString({ message: 'Name must be a string' })
    @MinLength(2, { message: 'Name must be at least 2 characters long' })
    @MaxLength(100, { message: 'Name cannot exceed 100 characters' })
    name: string;

    @ApiProperty({
        example: 'maria.gonzalez@uat.edu.mx',
        description: 'The institutional email of the professor',
        format: 'email',
    })
    @IsNotEmpty({ message: 'Institutional email is required' })
    @IsEmail({}, { message: 'Must be a valid email address' })
    institutionalEmail: string;

    @ApiProperty({
        example: 'securePassword123',
        description: 'The password for the professor account',
        minLength: 8,
        maxLength: 50,
    })
    @IsNotEmpty({ message: 'Password is required' })
    @IsString({ message: 'Password must be a string' })
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @MaxLength(50, { message: 'Password cannot exceed 50 characters' })
    institutionalPassword: string;
}
