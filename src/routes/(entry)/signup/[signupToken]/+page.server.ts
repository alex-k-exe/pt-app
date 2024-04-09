import { clients, signupTokens, trainers, users, type User } from '$lib/drizzleTables';
import { initDrizzle, validateForm } from '$lib/server/utils';
import { redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { Scrypt, generateId } from 'lucia';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema as signupTokenSchema } from '../schema.ts';
import { formSchema } from './schema';

export async function load(event) {
	const signupTokenId = Number(event.params.signupToken);
	const tokenWasValidated = event.url.searchParams.get('tokenIsValid');
	const targetHref = event.url.searchParams.get('targetHref');
	const signupRoute = '/signup' + targetHref ? `?targetHref=${targetHref}` : '';

	const db = initDrizzle(event.platform);
	if (!tokenWasValidated) {
		const tokenIsValid = (await signupTokenSchema(db)).parseAsync({ signupToken: signupTokenId });
		if (!tokenIsValid) {
			throw redirect(302, signupRoute);
		}
	}

	let trainer: User | null = null;
	const signupToken = (
		await db.select().from(signupTokens).limit(1).where(eq(signupTokens.id, signupTokenId))
	)[0];

	if (signupToken.trainerId) {
		console.log('trainer', signupToken.trainerId);
		trainer = (
			await db.select().from(users).limit(1).where(eq(users.id, signupToken.trainerId))
		)[0];
	}

	return {
		signupTokenId,
		trainer,
		targetHref,
		form: await superValidate(zod(await formSchema(initDrizzle(event.platform))))
	};
}

export const actions = {
	default: async (event) => {
		const db = initDrizzle(event.platform);
		const formData = (await validateForm(event, await formSchema(db))).data;
		if ('form' in formData) return formData;

		console.log(formData);
		const userId = generateId(15);
		const hashedPassword = await new Scrypt().hash(formData.password.password);

		await db.insert(users).values({
			id: userId,
			email: formData.email,
			password: hashedPassword,
			name: formData.name
		});
		if (formData.trainerId) {
			await db.insert(clients).values({ id: userId, trainerId: formData.trainerId });
		} else {
			await db.insert(trainers).values({ id: userId });
		}
		await db.delete(signupTokens).where(eq(signupTokens.id, formData.signupTokenId));

		const session = await event.locals.lucia.createSession(userId, {});
		const sessionCookie = event.locals.lucia.createSessionCookie(session.id);
		return new Response(null, {
			status: 302,
			headers: {
				Location: event.url.searchParams.get('targetHref') ?? '/workouts',
				'Set-Cookie': sessionCookie.serialize()
			}
		});
	}
};
