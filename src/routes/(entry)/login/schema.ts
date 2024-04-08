import { validPassword } from '$lib/utils/types/other.ts';
import { fail, type RequestEvent } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

export const formSchema = z.object({
	email: z.string().email().min(5).max(100),
	password: z.string().regex(validPassword).min(12).max(100),
	targetHref: z.string().max(100).nullish()
});

export type FormSchema = typeof formSchema;

type Event = RequestEvent<Params extends Partial<Record<string, string>>
export async function validateForm<T extends Event>(event: T) {
	const form = await superValidate(event, zod(formSchema));
	if (!form.valid) return fail(400, { form });
	return form;
}
