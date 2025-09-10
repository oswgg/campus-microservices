import { Professor } from '@/domain/entities/professor.entity';
import { ClassData } from '@campus/types';

export interface ProfessorRepository {
    findById(id: string): Promise<Professor | null>;
    findByEmail(email: string): Promise<Professor | null>;
    create(professor: Professor): Promise<Professor>;
    saveClasses(profId: any, data: ClassData[]): Promise<void>;
    getClasses(profId: any): Promise<ClassData[]>;
}

export const PROFESSOR_REPO_TOKEN = Symbol('professor.repo');
