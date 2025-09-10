import { Schema, model, Document } from 'mongoose';
import { ClassSchema } from './class.mongo.schema';

// MongoDB Document interface
export interface IProfessorDocument extends Document {
    name: string;
    institutionalEmail: string;
    institutionalPassword: string;
    createdAt: Date;
    updatedAt: Date;
}

// Mongoose Schema
export const ProfessorSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            maxlength: 255,
        },
        institutionalEmail: {
            type: String,
            required: true,
            unique: true,
            maxlength: 255,
        },
        institutionalPassword: {
            type: String,
            required: true,
            maxlength: 255,
        },
        classes: {
            type: Array,
            default: [],
            items: ClassSchema,
        },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt
        collection: 'professors', // Explicit collection name
    },
);

// Mongoose Model
export const ProfessorModel = model<IProfessorDocument>(
    'Professor',
    ProfessorSchema,
);

// Plain TypeScript interface for MongoDB native driver
export interface IProfessor {
    _id?: string;
    name: string;
    institutionalEmail: string;
    institutionalPassword: string;
    createdAt?: Date;
    updatedAt?: Date;
}

// Collection name constant
export const PROFESSOR_COLLECTION = 'professors';
