import { pgTable, serial, varchar } from 'drizzle-orm/pg-core';

export const professor = pgTable('professors', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    institutionalEmail: varchar('institutional_email', { length: 255 }).notNull().unique(),
    institutionalPassword: varchar('institutional_password', { length: 255 }).notNull(),
});
