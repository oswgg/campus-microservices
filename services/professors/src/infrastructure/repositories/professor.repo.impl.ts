import { Injectable } from '@nestjs/common';
import { ProfessorRepository } from '@/application/repositories/professor.repo';
import { Professor } from '@/domain/entities/professor.entity';
import { DrizzleService } from '../db/drizzle/drizzle.service';
import { professor } from '../db/drizzle/schemas';
import { eq } from 'drizzle-orm';
import { ClassData } from '@campus/libs';

@Injectable()
export class ProfessorRepoImpl implements ProfessorRepository {
    constructor(private readonly drizzle: DrizzleService) {}

    async create(data: Professor): Promise<Professor> {
        try {
            const [created] = await this.drizzle.db
                .insert(professor)
                .values({
                    name: data.name,
                    institutionalEmail: data.institutionalEmail,
                    institutionalPassword: data.institutionalPassword,
                })
                .returning();

            return new Professor(
                created.id,
                created.name,
                created.institutionalEmail,
                created.institutionalPassword,
            );
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async findByEmail(email: string): Promise<Professor | null> {
        const [result] = await this.drizzle.db
            .select()
            .from(professor)
            .where(eq(professor.institutionalEmail, String(email)));

        if (!result) {
            return null;
        }

        return new Professor(
            result.id,
            result.name,
            result.institutionalEmail,
            result.institutionalPassword,
        );
    }

    async findById(id: string): Promise<any> {
        const [result] = await this.drizzle.db
            .select()
            .from(professor)
            .where(eq(professor.id, Number(id)));

        if (!result) {
            return null;
        }

        return new Professor(
            result.id,
            result.name,
            result.institutionalEmail,
            result.institutionalPassword,
        );
    }

    async saveClasses(data: any): Promise<void> {}

    async getClasses(profId: any): Promise<ClassData[]> {
        return [];
    }
}
