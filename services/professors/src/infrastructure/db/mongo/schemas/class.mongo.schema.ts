import { Schema, model, Document } from 'mongoose';

export const ClassSchema = new Schema(
    {
        group: { type: String, required: true },
        classroom: { type: String, required: true },
        subject: { type: String, required: true },
        period: { type: Number, required: true },
        students: [
            {
                number: { type: Number, required: true },
                name: { type: String, required: true },
            },
        ],
    },
    { _id: false },
);
