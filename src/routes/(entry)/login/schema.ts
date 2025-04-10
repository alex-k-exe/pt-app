// not using $lib because it doesn't work when running drizzle studio
import { validEmail, validPassword } from '../../../lib/utils/types.ts';
import { z } from 'zod';

export const formSchema = z.object({
	email: z.string().regex(validEmail.regex, validEmail.message).min(5).max(100),
	password: z.string().regex(validPassword.regex, validPassword.message).min(12).max(100)
});
