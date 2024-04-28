import { clients, signupTokens, trainers, users, type User } from '$lib/drizzleTables';
import { userTypes } from '$lib/utils/types';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { Scrypt } from 'lucia';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { asyncTokenSchema, formSchema } from '../schema';

export async function load({ params, url, locals }) {
	const signupTokenId = Number(params.signupToken);
	const targetPath = url.searchParams.get('targetPath');

	const db = locals.db;
	const tokenValidation = await (await asyncTokenSchema(db)).safeParseAsync(signupTokenId);
	if (!tokenValidation.success) {
		return redirect(
			302,
			'/signup' +
				`?error=${tokenValidation.error.errors[0].message}` +
				(targetPath ? `&targetPath=${targetPath}` : '')
		);
	}

	let trainer: User | null = null;
	const signupToken = (
		await db.select().from(signupTokens).limit(1).where(eq(signupTokens.id, tokenValidation.data))
	)[0];

	if (!signupToken) {
		return redirect(302, '/signup' + (targetPath ? `?targetPath=${targetPath}` : ''));
	}
	if (signupToken.trainerId) {
		trainer = (
			await db.select().from(users).limit(1).where(eq(users.id, signupToken.trainerId))
		)[0];
	}

	return {
		signupTokenId,
		trainer,
		form: await superValidate(zod(formSchema))
	};
}

export const actions = {
	default: async (event) => {
		const db = event.locals.db;
		let form = await superValidate(event, zod(formSchema));
		if (!form.valid) return fail(400, { form });

		const emails = await db
			.select({ email: users.email })
			.from(users)
			.limit(1)
			.where(eq(users.email, form.data.email));
		if (emails.length > 0) {
			return redirect(302, event.url.pathname + `?error=Email has already been used`);
		}

		const hashedPassword = await new Scrypt().hash(form.data.password);
		const user = (
			await db
				.insert(users)
				.values({
					email: form.data.email,
					password: hashedPassword,
					name: form.data.name
				})
				.returning()
		)[0];

		if (form.data.trainerId) {
			await db.insert(clients).values({ id: user.id, trainerId: form.data.trainerId });
			event.cookies.set('userType', userTypes.CLIENT, { path: '.' });
		} else {
			await db.insert(trainers).values({ id: user.id });
			event.cookies.set('userType', userTypes.TRAINER, { path: '.' });
		}
		await db.delete(signupTokens).where(eq(signupTokens.id, Number(event.params.signupToken)));

		const session = await event.locals.lucia.createSession(user.id, {});
		const sessionCookie = event.locals.lucia.createSessionCookie(session.id);
		event.cookies.set(event.locals.lucia.sessionCookieName, sessionCookie.value, { path: '.' });

		return redirect(302, event.url.searchParams.get('targetPath') ?? '/workouts');
	}
};
