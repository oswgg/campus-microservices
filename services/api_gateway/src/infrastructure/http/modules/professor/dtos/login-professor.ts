import { UATCredentials } from '@campus/libs';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginProfessorDto {
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
    institutionalPassword: string;
}
