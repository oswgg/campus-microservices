import { LoginProfessorDto, UATCredentials } from '@campus/libs';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginProfessorInput implements LoginProfessorDto {
    @ApiProperty({
        example: 'maria.gonzalez@uat.edu.mx',
        description: 'El correo institucional del profesor',
        format: 'email',
    })
    @IsNotEmpty({ message: 'Institutional email is required' })
    @IsEmail({}, { message: 'Must be a valid email address' })
    institutionalEmail: string;

    @ApiProperty({
        example: 'Y65ruAZiQnCq5/NkzBxiuYwwwqKyp/YOC94SdylAR5yllHkH...',
        description: 'La constraseña encriptada del profesor',
    })
    @IsNotEmpty({ message: 'Password is required' })
    @IsString({ message: 'Password must be a string' })
    encryptedPassword: string;
}
