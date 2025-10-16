import { applyDecorators } from '@nestjs/common';
import {
    ApiOperation,
    ApiResponse,
    ApiBody,
    ApiHeaders,
} from '@nestjs/swagger';
import { RegisterProfessorInput } from './dtos/register-professor';
import { TakeAttendanceInput } from './dtos/take-attendance';
import { LoginProfessorInput } from './dtos/login-professor';

/**
 * Documentación para el endpoint de registro de profesores
 */
export const RegisterProfessorDocumentation = () =>
    applyDecorators(
        ApiOperation({
            summary: 'Registrar un nuevo profesor',
            description:
                'Crea una nueva cuenta de profesor con credenciales institucionales. Este endpoint es público y no requiere autenticación.',
        }),
        ApiBody({
            type: RegisterProfessorInput,
            description:
                'Datos de registro del profesor incluyendo credenciales institucionales',
        }),
        ApiResponse({
            status: 201,
            description: 'Profesor registrado exitosamente',
            schema: {
                type: 'object',
                properties: {
                    status: { type: 'number', example: 201 },
                    message: {
                        type: 'string',
                        example: 'Professor registered successfully',
                    },
                    data: {
                        type: 'object',
                        properties: {
                            id: { type: 'number', example: 1 },
                            name: {
                                type: 'string',
                                example: 'Dr. María González',
                            },
                            institutionalEmail: {
                                type: 'string',
                                example: 'maria.gonzalez@uat.edu.mx',
                            },
                        },
                    },
                    token: {
                        type: 'string',
                        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                    },
                },
            },
        }),
        ApiResponse({
            status: 400,
            description: 'Datos de entrada inválidos',
            schema: {
                type: 'object',
                properties: {
                    message: {
                        type: 'array',
                        items: { type: 'string' },
                        example: [
                            'institutionalEmail must be a valid email',
                            'encryptedPassword is required',
                        ],
                    },
                    error: { type: 'string', example: 'Bad Request' },
                    statusCode: { type: 'number', example: 400 },
                },
            },
        }),
        ApiResponse({
            status: 500,
            description: 'Error interno del servidor',
            schema: {
                type: 'object',
                properties: {
                    error: { type: 'string', example: 'Internal Server Error' },
                    message: {
                        type: 'string',
                        example: 'Failed to register professor',
                    },
                },
            },
        }),
    );

export const LoginProfessorDocumentation = () =>
    applyDecorators(
        ApiOperation({
            summary: 'Login de profesor',
            description:
                'Autentica a un profesor utilizando sus credenciales institucionales. Este endpoint es público y no requiere autenticación.',
        }),
        ApiBody({
            type: LoginProfessorInput,
            description:
                'Credenciales de inicio de sesión del profesor incluyendo correo electrónico y contraseña',
        }),
        ApiResponse({
            status: 200,
            description: 'Inicio de sesión exitoso',
            schema: {
                type: 'object',
                properties: {
                    status: { type: 'number', example: 200 },
                    message: { type: 'string', example: 'Login successful' },
                    data: {
                        type: 'object',
                        properties: {
                            name: {
                                type: 'string',
                                example: 'Dr. María González',
                            },
                            institutionalEmail: {
                                type: 'string',
                                example: 'maria.gonzalez@docentes.uat.edu.mx',
                            },
                        },
                    },
                    token: {
                        type: 'string',
                        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                    },
                },
            },
        }),
        ApiResponse({
            status: 400,
            description: 'Datos de entrada inválidos',
            schema: {
                type: 'object',
                properties: {
                    message: {
                        type: 'array',
                        items: { type: 'string' },
                        example: [
                            'institutionalEmail must be a valid email',
                            'encryptedPassword is required',
                        ],
                    },
                    error: { type: 'string', example: 'Bad Request' },
                    statusCode: { type: 'number', example: 400 },
                },
            },
        }),
    );

/**
 * Documentación para el endpoint de obtener clases del profesor
 */
export const GetProfessorClassesDocumentation = () =>
    applyDecorators(
        ApiOperation({
            summary: 'Obtener clases del profesor',
            description:
                'Obtiene la lista de clases asignadas al profesor autenticado. Incluye información de grupos, materias, estudiantes y horarios.',
        }),
        ApiHeaders([
            {
                name: 'Authorization',
                description: 'Token de autenticación Bearer JWT',
                required: true,
                schema: {
                    type: 'string',
                    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                },
            },
        ]),
        ApiResponse({
            status: 200,
            description: 'Clases obtenidas exitosamente',
            schema: {
                type: 'object',
                properties: {
                    status: { type: 'number', example: 200 },
                    message: {
                        type: 'string',
                        example: 'Classes retrieved successfully',
                    },
                    data: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                group: { type: 'string', example: 'G' },
                                classroom: { type: 'string', example: 'D-409' },
                                subject: {
                                    type: 'string',
                                    example:
                                        '(RC.06061.2870.5-5) ESTRUCTURAS DE DATOS',
                                },
                                period: { type: 'number', example: 3 },
                                students: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            number: {
                                                type: 'number',
                                                example: 1,
                                            },
                                            name: {
                                                type: 'string',
                                                example:
                                                    'CERVANTES MORAN JORGE AIRAM',
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        }),
        ApiResponse({
            status: 401,
            description: 'Token de autenticación inválido o expirado',
            schema: {
                type: 'object',
                properties: {
                    message: { type: 'string', example: 'Unauthorized' },
                    statusCode: { type: 'number', example: 401 },
                },
            },
        }),
        ApiResponse({
            status: 400,
            description: 'Error al obtener las clases del profesor',
            schema: {
                type: 'object',
                properties: {
                    error: {
                        type: 'string',
                        example: 'Failed to fetch professor classes',
                    },
                },
            },
        }),
        ApiResponse({
            status: 500,
            description: 'Error interno del servidor',
            schema: {
                type: 'object',
                properties: {
                    error: { type: 'string', example: 'Internal server error' },
                },
            },
        }),
    );

/**
 * Documentación para el endpoint de tomar asistencia
 */
export const TakeAttendanceDocumentation = () =>
    applyDecorators(
        ApiOperation({
            summary: 'Tomar asistencia de clase',
            description:
                'Inicia el proceso de toma de asistencia para una clase específica del profesor. Registra la asistencia de los estudiantes en el sistema.',
        }),
        ApiHeaders([
            {
                name: 'Authorization',
                description: 'Token de autenticación Bearer JWT',
                required: true,
                schema: {
                    type: 'string',
                    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                },
            },
        ]),
        ApiBody({
            type: TakeAttendanceInput,
            description:
                'Datos necesarios para tomar la asistencia incluyendo información de la clase y estudiantes',
        }),
        ApiResponse({
            status: 200,
            description: 'Proceso de toma de asistencia iniciado correctamente',
            schema: {
                type: 'object',
                properties: {
                    status: { type: 'number', example: 200 },
                    message: {
                        type: 'string',
                        example: 'Take attendance process initiated',
                    },
                    data: {
                        type: 'object',
                        description: 'Respuesta del servicio de asistencia',
                    },
                },
            },
        }),
        ApiResponse({
            status: 401,
            description: 'Token de autenticación inválido o expirado',
            schema: {
                type: 'object',
                properties: {
                    message: { type: 'string', example: 'Unauthorized' },
                    statusCode: { type: 'number', example: 401 },
                },
            },
        }),
        ApiResponse({
            status: 500,
            description: 'Error al iniciar el proceso de toma de asistencia',
            schema: {
                type: 'object',
                properties: {
                    error: {
                        type: 'string',
                        example: 'Failed to initiate take attendance process',
                    },
                },
            },
        }),
    );
