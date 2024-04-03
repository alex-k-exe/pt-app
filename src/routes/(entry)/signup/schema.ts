import { validSignupToken } from '$lib/utils/types/other.ts';
import { fail, type RequestEvent } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import type { RouteParams } from './$types';

export const formSchema = z.object({
	signupToken: z.string().regex(validSignupToken)
});

export type FormSchema = typeof formSchema;

export async function validateForm(event: RequestEvent<RouteParams, '/(entry)/login'>) {
	const form = await superValidate(event, zod(formSchema));
	if (!form.valid) return fail(400, { form });
	return form;
}
