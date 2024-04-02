import { validEmail, validPassword } from '$lib/utils/other';
import { fail, type RequestEvent } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import type { RouteParams } from './$types';

export const formSchema = z.object({
	user: z.object({
		email: z.string().regex(validEmail).min(5).max(100),
		password: z.string().regex(validPassword).min(12).max(100),
		name: z.string().min(1).max(100)
	}),
	trainerId: z.string().max(100),
	targetHref: z.string().max(100)
});

export type FormSchema = typeof formSchema;

export async function validateForm(
	event: RequestEvent<RouteParams, '/(entry)/signup' | '/(entry)/login'>
) {
	const form = await superValidate(event, zod(formSchema));
	if (!form.valid) return fail(400, { form });
	return form;
}
