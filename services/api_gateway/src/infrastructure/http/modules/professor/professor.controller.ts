import {
    Body,
    Controller,
    Inject,
    Post,
    Get,
    UseGuards,
    InternalServerErrorException,
    Req,
    HttpStatus,
    BadRequestException,
    Logger,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import {
    RegisterProfessorDocumentation,
    GetProfessorClassesDocumentation,
    TakeAttendanceDocumentation,
    LoginProfessorDocumentation,
} from './professor.swagger';
import { firstValueFrom } from 'rxjs';
import { RegisterProfessorDto } from './dtos/register-professor';
import { TakeAttendanceDto } from './dtos/take-attendance';
import { JwtAuthGuard } from '../../guards/jwt.guard';
import { RequiredApp } from '../../guards/app-access.decorator';
import { Public } from '../../guards/public-routes.decorator';
import {
    TOKEN_SERVICE_TOKEN,
    TokenService,
} from '@/application/services/token.service';
import { DomainApiResponse, TokenOutput } from '@/domain/api-response';
import { LoginProfessorDto } from './dtos/login-professor';
import {
    ClassData,
    RegisterProfessorOutput,
    SERVICE_NAMES,
} from '@campus/libs';

@ApiTags('Professors')
@Controller('professors')
@UseGuards(JwtAuthGuard)
@RequiredApp(SERVICE_NAMES.PROFESSOR)
export class ProfessorController {
    logger = new Logger(ProfessorController.name);

    constructor(
        @Inject(SERVICE_NAMES.PROFESSOR)
        private readonly professorService: ClientProxy,
        @Inject(SERVICE_NAMES.SCRAPER)
        private readonly scraperService: ClientProxy,
        @Inject(TOKEN_SERVICE_TOKEN)
        private readonly tokenService: TokenService,
    ) {}

    @Public()
    @Post('register')
    @RegisterProfessorDocumentation()
    async registerProfessor(
        @Body() body: RegisterProfessorDto,
    ): Promise<DomainApiResponse<RegisterProfessorOutput> & TokenOutput> {
        try {
            const response: RegisterProfessorOutput = await firstValueFrom(
                this.professorService.send('professor.register', body),
            );
            return {
                status: HttpStatus.CREATED,
                message: 'Professor registered successfully',
                data: response,
                token: await this.tokenService.sign({
                    id: response.id,
                    name: response.name,
                    email: response.email,
                    app: SERVICE_NAMES.PROFESSOR,
                }),
            };
        } catch (error) {
            this.logger.error('Error registering professor', error);
            throw new InternalServerErrorException({
                error: 'Internal Server Error',
                message: 'Failed to register professor',
            });
        }
    }

    @Public()
    @Post('login')
    @LoginProfessorDocumentation()
    async loginProfessor(
        @Body() body: LoginProfessorDto,
    ): Promise<DomainApiResponse<any> & TokenOutput> {
        try {
            const professor = await firstValueFrom(
                this.professorService.send('professor.login', body),
            );

            if (!professor) {
                throw new BadRequestException({
                    error: 'Invalid Credentials',
                    message: 'Email or password is incorrect',
                });
            }

            return {
                status: HttpStatus.OK,
                message: 'Login successful',
                data: professor,
                token: await this.tokenService.sign({
                    id: professor.id,
                    name: professor.name,
                    email: professor.email,
                    app: SERVICE_NAMES.PROFESSOR,
                }),
            };
        } catch (error) {
            this.logger.error('Error logging in professor', error, undefined);
            throw new InternalServerErrorException({
                error: 'Internal Server Error',
                message: 'Failed to login professor',
            });
        }
    }

    @Get('classes')
    @GetProfessorClassesDocumentation()
    async getProfessorClasses(
        @Req() request: any,
    ): Promise<DomainApiResponse<ClassData[]> | { error: string }> {
        try {
            const classes: ClassData[] = await firstValueFrom(
                this.professorService.send('professor.get_classes', {
                    profId: request.user.id,
                }),
            );
            return {
                status: HttpStatus.OK,
                message: 'Classes retrieved successfully',
                data: classes,
            };
        } catch (error) {
            this.logger.error('Error fetching professor classes', error);
            return { error: 'Failed to fetch professor classes' };
        }
    }

    @Post('take-attendance')
    @TakeAttendanceDocumentation()
    async takeAttendanceForClass(
        @Req() request: any,
        @Body() body: TakeAttendanceDto,
    ): Promise<DomainApiResponse<any> | { error: string }> {
        try {
            const response = this.professorService.send(
                'professor.take_attendance_for_class',
                { profId: request.user.id, ...body },
            );

            return {
                status: HttpStatus.OK,
                message: 'Take attendance process initiated',
                data: response,
            };
        } catch (error) {
            this.logger.error('Error initiating take attendance', error);
            return { error: 'Failed to initiate take attendance process' };
        }
    }
}
