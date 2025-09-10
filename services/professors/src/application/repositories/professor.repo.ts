import { Professor } from '@/domain/entities/professor.entity';

export interface ProfessorRepository {
    findById(id: string): Promise<Professor | null>;
    findByEmail(email: string): Promise<Professor | null>;
    create(professor: Professor): Promise<Professor>;
}

export const PROFESSOR_REPO_TOKEN = Symbol('professor.repo');
