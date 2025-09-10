export * from './professor.schema';

// Exportar el esquema completo para Drizzle
import { professor } from './professor.schema';

export const schema = {
    professor,
};

// Tipos de utilidad
export type Schema = typeof schema;
