import { ClassData, SERVICE_NAMES } from '@campus/types';
import {
    Body,
    Controller,
    Inject,
    Post,
    HttpStatus,
    Get,
    Query,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiQuery,
    ApiBody,
} from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import { RegisterProfessorDto } from './dtos/register-professor';

@ApiTags('Professors')
@Controller('professors')
export class ProfessorController {
    constructor(
        @Inject(SERVICE_NAMES.PROFESSOR)
        private readonly professorService: ClientProxy,
    ) {}

    @Post('register')
    @ApiOperation({
        summary: 'Register a new professor',
        description:
            'Creates a new professor account with institutional credentials',
    })
    @ApiBody({
        type: RegisterProfessorDto,
        description: 'Professor registration data',
    })
    @ApiResponse({
        status: 201,
        description: 'Professor registered successfully',
        schema: {
            example: {
                status: 201,
                message: 'Professor registered successfully',
            },
        },
    })
    @ApiResponse({
        status: 400,
        description: 'Bad request - Invalid data',
        schema: {
            example: {
                error: 'Failed to register professor',
            },
        },
    })
    async registerProfessor(@Body() body: RegisterProfessorDto) {
        try {
            await firstValueFrom(
                this.professorService.send({ cmd: 'register' }, body),
            );
            return {
                status: HttpStatus.CREATED,
                message: 'Professor registered successfully',
            };
        } catch (error) {
            return { error: 'Failed to register professor' };
        }
    }

    @Get('classes')
    @ApiOperation({
        summary: 'Get professor classes',
        description: 'Fetches classes for a professor using their credentials',
    })
    @ApiQuery({
        name: 'id',
        description: 'Professor ID',
        example: '1',
        required: true,
    })
    @ApiResponse({
        status: 200,
        description: 'Classes retrieved successfully',
        schema: {
            example: [
                {
                    group: 'G',
                    classroom: 'D-409',
                    subject: '(RC.06061.2870.5-5) ESTRUCTURAS DE DATOS',
                    period: 3,
                    students: [
                        {
                            number: 1,
                            name: 'CERVANTES MORAN JORGE AIRAM',
                        },
                    ],
                },
            ],
        },
    })
    @ApiResponse({
        status: 400,
        description: 'Failed to fetch classes',
        schema: {
            example: {
                error: 'Failed to fetch professor classes',
            },
        },
    })
    async getProfessorClasses(
        @Query('id') id: any,
    ): Promise<ClassData[] | { error: string }> {
        try {
            const classes = await firstValueFrom(
                this.professorService.send(
                    { cmd: 'get_classes' },
                    { profId: id },
                ),
            );
            return classes;
        } catch (error) {
            return { error: 'Failed to fetch professor classes' };
        }
    }
}
