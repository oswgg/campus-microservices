import { ConnectionsConfig } from '@/infrastructure/http/modules/config/connections.config';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { MongoClient, Db } from 'mongodb';
import * as mongoose from 'mongoose';

@Injectable()
export class MongoService implements OnModuleDestroy, OnModuleInit {
    private client: MongoClient;
    public db: Db;
    public mongoose: typeof mongoose;

    constructor(private readonly connectionsConfig: ConnectionsConfig) {}

    async onModuleInit() {
        const mongoUri = this.connectionsConfig.mongoUrl;

        this.client = new MongoClient(mongoUri);
        await this.client.connect();
        this.db = this.client.db();

        await mongoose.connect(mongoUri);
        this.mongoose = mongoose;

        console.log('MongoDB connected successfully');
    }

    async onModuleDestroy() {
        if (this.client) {
            await this.client.close();
        }
        if (mongoose.connection.readyState === 1) {
            await mongoose.disconnect();
        }
    }

    // Utility method to get collection
    getCollection<T = any>(name: string) {
        return this.db.collection<T>(name);
    }
}
