import { clients, signupTokens, trainers, users, type User } from '$lib/drizzleTables';
import { initDrizzle } from '$lib/server/utils';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { Scrypt } from 'lucia';
import { superValidate, type SuperValidated } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { asyncTokenSchema, formSchema, type FormSchema } from '../schema';

export async function load({ params, url, platform }) {
	console.log('redirected');
	const signupTokenId = Number(params.signupToken);
	const targetPath = url.searchParams.get('targetPath');

	const db = initDrizzle(platform);
	const tokenValidation = await (await asyncTokenSchema(db)).safeParseAsync(signupTokenId);
	console.log('final');
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
		targetPath,
		form: await superValidate(zod(await formSchema(db)))
	};
}

export const actions = {
	default: async (event) => {
		const db = initDrizzle(event.platform);
		let form: FormSchema | SuperValidated<FormSchema> = await superValidate(
			event,
			zod(await formSchema(db))
		);
		if (!form.valid) return fail(400, { form });
		form = form.data;
		console.log('you are valid :)');

		const hashedPassword = await new Scrypt().hash(form.password);

		const user = (
			await db
				.insert(users)
				.values({
					email: form.email,
					password: hashedPassword,
					name: form.name
				})
				.returning()
		)[0];
		console.log('last');
		if (form.trainerId) {
			await db.insert(clients).values({ id: user.id, trainerId: form.trainerId });
		} else {
			await db.insert(trainers).values({ id: user.id });
		}
		await db.delete(signupTokens).where(eq(signupTokens.id, form.signupTokenId));

		const session = await event.locals.lucia.createSession(user.id, {});
		const sessionCookie = event.locals.lucia.createSessionCookie(session.id);
		return new Response(null, {
			status: 302,
			headers: {
				Location: decodeURIComponent(event.url.searchParams.get('targetPath') ?? '/workouts'),
				'Set-Cookie': sessionCookie.serialize()
			}
		});
	}
};
