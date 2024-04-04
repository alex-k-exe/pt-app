import { clients, signupTokens, trainers, users, type User } from '$lib/drizzleTables';
import { initDrizzle } from '$lib/server/utils';
import { isSignupTokenValid } from '$lib/utils/types/other.ts';
import { fail, redirect } from '@sveltejs/kit';
import dayjs from 'dayjs';
import { eq, lte } from 'drizzle-orm';
import { Scrypt, generateId } from 'lucia';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema, validateForm } from './schema';

export async function load({ platform, url, params }) {
	const signupTokenId = Number(params.signupToken);
	const targetHref = url.searchParams.get('targetHref');

	let trainer: User | null = null;
	console.log(signupTokenId);
	if (!signupTokenId || !isSignupTokenValid(signupTokenId)) {
		return redirect(302, `/signup?error="Token is invalid"&targetHref=${targetHref}`);
	}

	const db = initDrizzle(platform);
	await db
		.delete(signupTokens)
		// TODO: this is wrong
		.where(lte(signupTokens.creationTimeDate, dayjs().subtract(10, 'hour').toString()));
	const signupToken = (
		await db.select().from(signupTokens).limit(1).where(eq(signupTokens.id, signupTokenId))
	)[0];

	if (!signupToken) return redirect(302, `/signup?error=Token expired&targetHref=${targetHref}`);
	if (signupToken.trainerId) {
		console.log('trainer', signupToken.trainerId);
		trainer = (
			await db.select().from(users).limit(1).where(eq(users.id, signupToken.trainerId))
		)[0];
	}
	await db.delete(signupTokens).where(eq(signupTokens.id, signupTokenId));

	return {
		signupTokenId,
		trainer,
		targetHref,
		form: await superValidate(zod(formSchema))
	};
}

export const actions = {
	default: async (event) => {
		const formData = (await validateForm(event)).data;
		if ('form' in formData) return formData;
		const userId = generateId(15);
		const hashedPassword = await new Scrypt().hash(formData.user.password);

		const db = initDrizzle(event.platform);
		try {
			await db.insert(users).values({
				id: userId,
				email: formData.user.email,
				password: hashedPassword,
				name: formData.user.name
			});
		} catch {
			return fail(400, { message: 'Email already used' });
		}

		if (formData.trainerId) {
			await db.insert(clients).values({ id: userId, trainerId: formData.trainerId });
		} else {
			await db.insert(trainers).values({ id: userId });
		}

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
