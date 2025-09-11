import { ProfessorRepository } from '@/application/repositories/professor.repo';
import { Professor } from '@/domain/entities/professor.entity';
import { MongoService } from '../db/mongo/mongo.service';
import { Injectable } from '@nestjs/common';
import { ClassData } from '@campus/types';
import { ObjectId } from 'mongodb';

@Injectable()
export class ProfessorMongoRepoImpl implements ProfessorRepository {
    constructor(private readonly mongo: MongoService) {}

    async create(professor: Professor): Promise<Professor> {
        try {
            const created = await this.mongo.db
                .collection('professors')
                .insertOne({
                    name: professor.name,
                    institutionalEmail: professor.institutionalEmail,
                    institutionalPassword: professor.institutionalPassword,
                });

            return new Professor(
                created.insertedId,
                professor.name,
                professor.institutionalEmail,
                professor.institutionalPassword,
            );
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async findByEmail(email: string): Promise<Professor | null> {
        try {
            const result = await this.mongo.db
                .collection('professors')
                .findOne({ institutionalEmail: email });

            if (!result) {
                return null;
            }

            return new Professor(
                result._id,
                result.name,
                result.institutionalEmail,
                result.institutionalPassword,
            );
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async findById(id: any): Promise<Professor | null> {
        try {
            const result = await this.mongo.db
                .collection('professors')
                .findOne({ _id: new ObjectId(id) });

            if (!result) {
                return null;
            }

            return new Professor(
                result._id,
                result.name,
                result.institutionalEmail,
                result.institutionalPassword,
            );
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async saveClasses(profId: any, classes: ClassData[]): Promise<void> {
        try {
            const result = await this.mongo.db
                .collection('professors')
                .updateOne(
                    { _id: new ObjectId(profId) },
                    { $set: { classes: classes } },
                );

            if (result.matchedCount === 0) {
                throw new Error('Professor not found');
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    async getClasses(profId: any): Promise<ClassData[] | null> {
        try {
            const result = await this.mongo.db
                .collection('professors')
                .findOne({ _id: new ObjectId(profId) });

            if (!result || !result.classes) {
                return null;
            }

            return result.classes;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}
