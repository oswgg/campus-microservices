import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { schema, Schema } from './schemas';

@Injectable()
export class DrizzleService implements OnModuleDestroy, OnModuleInit {
    protected pool: Pool;
    public db: NodePgDatabase<Schema>;

    async onModuleInit() {
        this.pool = new Pool({
            connectionString: process.env.DB_URL, // TODO: Cambiar por postgres
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
        });

        this.db = drizzle(this.pool, { schema });
    }

    async onModuleDestroy() {
        await this.pool.end();
    }
}
