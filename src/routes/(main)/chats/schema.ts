import { z } from 'zod';

export const formSchema = z.object({ chatId: z.number().positive(), text: z.string().max(1000) });
