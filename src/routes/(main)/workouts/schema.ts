import { z } from 'zod';

export const yearSchema = z.number().int().positive().gt(1950).lt(3000);
export const selectClientSchema = z.object({ clientId: z.string().length(15) });
