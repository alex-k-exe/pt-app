import { fail, type RequestEvent } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import type { RouteParams } from './$types';

export const formSchema = z.object({ message: z.string().max(1000) });

export async function validateForm(event: RequestEvent<RouteParams, '/(main)/chats'>) {
	const form = await superValidate(event, zod(formSchema));
	if (!form.valid) return fail(400, { form });
	return form;
}
